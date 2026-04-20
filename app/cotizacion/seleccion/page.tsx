"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StoredQuoteProduct = {
  id: number;
  slug: string;
  name: string;
  priceBase: number;
  imageUrl?: string | null;
};

const STORAGE_KEY = "gm_quote_products";

export default function QuoteSelectionPage() {
  const [products, setProducts] = useState<StoredQuoteProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: StoredQuoteProduct[] = raw ? JSON.parse(raw) : [];
      setProducts(parsed);
    } catch {
      setProducts([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  function removeProduct(id: number) {
    const updated = products.filter((product) => product.id !== id);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function clearAll() {
    setProducts([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  const total = useMemo(() => {
    return products.reduce((sum, product) => sum + product.priceBase, 0);
  }, [products]);

  if (!loaded) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-600">Cargando selección...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Productos seleccionados</h1>
            <p className="mt-2 text-gray-600">
              Revisa los productos que quieres incluir en tu solicitud de cotización.
            </p>
          </div>

          {products.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Vaciar selección
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">No has agregado productos todavía</h2>
            <p className="mt-3 text-gray-600">
              Explora el catálogo y agrega los productos que deseas cotizar.
            </p>

            <Link
              href="/catalogo"
              className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
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

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/catalogo/${product.slug}`}
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Ver producto
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Quitar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-xl border p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total estimado base</p>
                  <p className="text-2xl font-bold">
                    ${total.toLocaleString("es-CO")}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    El valor final puede variar según medidas, materiales y acabados.
                  </p>
                </div>

                <Link
                  href="/cotizacion"
                  className="rounded-lg bg-black px-5 py-3 text-white"
                >
                  Continuar con la cotización
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}