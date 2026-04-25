export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/573044170401?text=Hola,%20quiero%20información%20sobre%20sus%20servicios%20de%20carpintería"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl text-white shadow-lg transition hover:bg-green-700"
    >
      💬
    </a>
  );
}