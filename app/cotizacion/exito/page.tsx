import Link from "next/link";

export default function CotizacionExitoPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl rounded-xl border p-8 text-center">
        <h1 className="text-3xl font-bold">Cotización enviada con éxito</h1>

        <p className="mt-4 text-gray-600">
          Hemos recibido tu solicitud de cotización. Pronto nos pondremos en
          contacto contigo.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/catalogo"
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Volver al catálogo
          </Link>

          <Link
            href="/"
            className="rounded-lg border px-5 py-3"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}