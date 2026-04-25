import ContactForm from "./ui/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr]">
        <section>
          <h1 className="text-3xl font-bold">Contacto</h1>
          <p className="mt-3 text-gray-600">
            Escríbenos y cuéntanos qué necesitas. También puedes comunicarte por
            WhatsApp para una atención más rápida.
          </p>

          <div className="mt-8 rounded-xl border p-6">
            <h2 className="text-xl font-semibold">Información de contacto</h2>

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">Correo:</span>{" "}
                info@gmcarpinteros.com
              </p>
              <p>
                <span className="font-medium">Teléfono:</span> +57 304 417 0401
              </p>
              <p>
                <span className="font-medium">WhatsApp:</span>{" "}
                +57 304 417 0401
              </p>
            </div>

            <a
              href="https://wa.me/573044170401?text=Hola,%20quiero%20información%20sobre%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 text-white"
            >
              Ir a WhatsApp
            </a>
          </div>
        </section>

        <section>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}