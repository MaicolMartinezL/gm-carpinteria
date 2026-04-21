"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type StoredQuoteProduct = {
  id: number;
  slug: string;
  name: string;
  priceBase: number;
  imageUrl?: string | null;
};

const STORAGE_KEY = "gm_quote_products";

export default function CotizacionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productSlug = searchParams.get("product");

  const [products, setProducts] = useState<StoredQuoteProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [needsDescription, setNeedsDescription] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const storedProducts: StoredQuoteProduct[] = raw ? JSON.parse(raw) : [];

      if (productSlug) {
        const existing = storedProducts.find((item) => item.slug === productSlug);

        if (existing) {
          setProducts([existing]);
        } else {
          setProducts([]);
        }
      } else {
        setProducts(storedProducts);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoaded(true);
    }
  }, [productSlug]);

  function removeProduct(id: number) {
    const updated = products.filter((product) => product.id !== id);
    setProducts(updated);

    const raw = localStorage.getItem(STORAGE_KEY);
    const storedProducts: StoredQuoteProduct[] = raw ? JSON.parse(raw) : [];
    const synced = storedProducts.filter((product) => product.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
  }

  const total = useMemo(() => {
    return products.reduce((sum, product) => sum + product.priceBase, 0);
  }, [products]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (products.length === 0) {
      setErrorMessage("Debes seleccionar al menos un producto para cotizar.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          needsDescription,
          products: products.map((product) => ({ id: product.id })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || "No fue posible enviar la cotización.");
        return;
      }

      if (!productSlug) {
        localStorage.removeItem(STORAGE_KEY);
      }

      router.push("/cotizacion/exito");
    } catch {
      setErrorMessage("Ocurrió un error al enviar la cotización.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-600">Cargando cotización...</p>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-3xl rounded-xl border p-8 text-center">
          <h1 className="text-3xl font-bold">No hay productos seleccionados</h1>
          <p className="mt-4 text-gray-600">
            Debes agregar al menos un producto antes de solicitar una cotización.
          </p>

          <Link
            href="/catalogo"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            Ir al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Solicitar cotización</h1>
              <p className="mt-2 text-gray-600">
                Revisa los productos seleccionados y completa tus datos.
              </p>
            </div>

            {!productSlug && (
              <Link
                href="/cotizacion/seleccion"
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Ver selección
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.imageUrl || "/placeholder-product.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      ${product.priceBase.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>

                {!productSlug && (
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="rounded-lg border px-4 py-2 text-sm"
                  >
                    Quitar
                  </button>
                )}
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-xl border p-5">
            <p className="text-sm text-gray-500">Total estimado base</p>
            <p className="mt-2 text-2xl font-bold">
              ${total.toLocaleString("es-CO")}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              El valor final puede variar según medidas, materiales y acabados.
            </p>
          </div>
        </section>

        <section>
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border p-6">
            <div>
              <label htmlFor="customerName" className="mb-2 block font-medium">
                Nombre completo
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="mb-2 block font-medium">
                Correo electrónico
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                required
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="mb-2 block font-medium">
                Teléfono
              </label>
              <input
                id="customerPhone"
                name="customerPhone"
                type="text"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="needsDescription" className="mb-2 block font-medium">
                Detalles de la cotización
              </label>
              <textarea
                id="needsDescription"
                name="needsDescription"
                required
                rows={5}
                value={needsDescription}
                onChange={(event) => setNeedsDescription(event.target.value)}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Cuéntanos qué necesitas, medidas aproximadas, materiales o acabados deseados."
              />
            </div>

            {errorMessage && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-black px-5 py-3 text-white disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Enviar cotización"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}