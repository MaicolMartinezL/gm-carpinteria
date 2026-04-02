import type { Metadata } from "next"; // importa el tipo Metadata para definir información global del sitio
import Link from "next/link"; // importa Link para navegar entre páginas sin recargar todo
import "./globals.css"; // importa los estilos globales

export const metadata: Metadata = { // define metadatos globales del sitio
  title: "GM Carpintería", // título principal del sitio
  description: "Catálogo y cotizaciones para empresa de carpintería", // descripción general del proyecto
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { // crea el layout raíz que envuelve toda la aplicación
  return (
    <html lang="es"> {/* define el idioma principal del documento */}
      <body className="min-h-screen bg-white text-black-900"> {/* define estilos base del body */}
        <header className="border-b bg-white"> {/* crea el encabezado superior con borde inferior */}
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"> {/* centra el contenido del header y organiza logo y navegación */}
            <Link href="/" className="text-xl font-bold text-black"> {/* enlace al inicio del sitio */}
              GM Carpintería {/* nombre o logo textual del proyecto */}
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium text-black"> {/* navegación principal */}
              <Link href="/" className="hover:text-black transition"> {/* enlace a la página de inicio */}
                Inicio
              </Link>

              <Link href="/catalogo" className="hover:text-black transition"> {/* enlace al catálogo */}
                Catálogo
              </Link>

              <Link href="/admin" className="hover:text-black transition"> {/* enlace al panel admin */}
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-10"> {/* contenedor principal para todas las páginas */}
          {children} {/* aquí se renderiza el contenido de cada página */}
        </div>

        <footer className="border-t bg-gray-100"> {/* pie de página con borde superior */}
          <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-red-600"> {/* contenedor del footer */}
            © 2026 GM Carpintería. Todos los derechos reservados. {/* texto del footer */}
          </div>
        </footer>
      </body>
    </html>
  );
}
