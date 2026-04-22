import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

type QuoteProductInput = {
  id: number;
};

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    const body = await request.json();

    const customerName = body.customerName?.trim() || "";
    const customerEmail = body.customerEmail?.trim() || "";
    const customerPhone = body.customerPhone?.trim() || "";
    const needsDescription = body.needsDescription?.trim() || "";
    const products = Array.isArray(body.products) ? body.products : [];

    if (!customerName || !customerEmail || !needsDescription) {
      return NextResponse.json(
        { error: "Los campos obligatorios no fueron diligenciados." },
        { status: 400 }
      );
    }

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Debes seleccionar al menos un producto para cotizar." },
        { status: 400 }
      );
    }

    const productIds = products
      .map((product: QuoteProductInput) => Number(product.id))
      .filter((id: number) => !Number.isNaN(id));

    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
      select: { id: true },
    });

    if (existingProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "Uno o más productos seleccionados no son válidos." },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        needsDescription,
        customerId: session?.role === "CLIENT" ? session.userId : null,
        items: {
          create: existingProducts.map((product) => ({
            productId: product.id,
            quantity: 1,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      { ok: true, quoteId: quote.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando cotización:", error);

    return NextResponse.json(
      { error: "Ocurrió un error al crear la cotización." },
      { status: 500 }
    );
  }
}