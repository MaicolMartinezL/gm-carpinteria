import { prisma } from "@/lib/prisma"; // importa la instancia de Prisma para consultar la base de datos
import { redirect } from "next/navigation"; // importa redirect para redirigir después de guardar la cotización

type CotizacionPageProps = { // define el tipo de props que recibirá la página
  searchParams: Promise<{ product?: string }>; // define que la URL puede traer un parámetro llamado product
};

export default async function CotizacionPage({ searchParams }: CotizacionPageProps) { // crea la página de cotización
  const { product: productSlug } = await searchParams; // extrae el slug del producto desde la URL, por ejemplo ?product=cocina-integral-basica

  const product = productSlug // verifica si se recibió un slug en la URL
    ? await prisma.product.findUnique({ // si sí hay slug, busca el producto en la base de datos
        where: { slug: productSlug }, // busca por el campo slug
      })
    : null; // si no hay slug, deja product como null

  async function createQuote(formData: FormData) { // define una server action para guardar la cotización
    "use server"; // indica que esta función se ejecuta en el servidor

    const customerName = formData.get("customerName")?.toString().trim() || ""; // obtiene el nombre desde el formulario
    const customerEmail = formData.get("customerEmail")?.toString().trim() || ""; // obtiene el correo desde el formulario
    const customerPhone = formData.get("customerPhone")?.toString().trim() || ""; // obtiene el teléfono desde el formulario
    const message = formData.get("message")?.toString().trim() || ""; // obtiene el mensaje desde el formulario
    const productIdValue = formData.get("productId")?.toString() || ""; // obtiene el id del producto como texto

    if (!customerName || !customerEmail || !customerPhone || !message || !productIdValue) { // valida que todos los campos obligatorios existan
      throw new Error("Todos los campos son obligatorios."); // lanza error si falta alguno
    }

    const productId = Number(productIdValue); // convierte el productId de texto a número

    if (Number.isNaN(productId)) { // valida que el productId sea un número válido
      throw new Error("El producto no es válido."); // lanza error si no lo es
    }

    await prisma.quote.create({ // crea una nueva cotización
  data: { // define los datos que se van a guardar
    customerName, // nombre del cliente
    customerEmail, // correo del cliente
    customerPhone, // teléfono del cliente
    message, // mensaje de la cotización
    product: { // define la relación con Product
      connect: { // conecta con un registro ya existente
        id: productId, // usa el id del producto recibido del formulario
      },
    },
  },
});

    redirect("/cotizacion/exito"); // redirige a una página de éxito después de guardar
  }

  if (!product) { // verifica si no se encontró un producto válido
    return ( // retorna una vista simple si no hay producto
      <main className="min-h-screen p-8"> {/* contenedor principal */}
        <div className="mx-auto max-w-2xl"> {/* centra el contenido y limita el ancho */}
          <h1 className="text-3xl font-bold">Producto no encontrado</h1> {/* título */}
          <p className="mt-4 text-gray-600">Debes entrar a este formulario desde un producto del catálogo.</p> {/* mensaje de ayuda */}
        </div>
      </main>
    );
  }

  return ( // retorna la interfaz del formulario cuando sí existe el producto
    <main className="min-h-screen p-8"> {/* contenedor principal con padding */}
      <div className="mx-auto max-w-2xl"> {/* centra el formulario y limita su ancho */}
        <h1 className="text-3xl font-bold">Solicitar cotización</h1> {/* título principal */}
        
        <p className="mt-2 text-gray-600">Producto seleccionado: <span className="font-semibold">{product.name}</span></p> {/* muestra el producto elegido */}

        <form action={createQuote} className="mt-8 space-y-5"> {/* formulario que ejecuta la server action al enviarse */}
          <input type="hidden" name="productId" value={product.id} /> {/* campo oculto para enviar el id del producto */}

          <div> {/* grupo del campo nombre */}
            <label htmlFor="customerName" className="mb-2 block font-medium">Nombre completo</label> {/* etiqueta del nombre */}
            <input
              id="customerName" // id del input
              name="customerName" // nombre que se enviará en el FormData
              type="text" // tipo texto
              required // obliga a llenar el campo
              className="w-full rounded-lg border px-4 py-3" // estilos del input
            />
          </div>

          <div> {/* grupo del campo correo */}
            <label htmlFor="customerEmail" className="mb-2 block font-medium">Correo electrónico</label> {/* etiqueta del correo */}
            <input
              id="customerEmail" // id del input
              name="customerEmail" // nombre del campo
              type="email" // tipo email
              required // campo obligatorio
              className="w-full rounded-lg border px-4 py-3" // estilos del input
            />
          </div>

          <div> {/* grupo del campo teléfono */}
            <label htmlFor="customerPhone" className="mb-2 block font-medium">Teléfono</label> {/* etiqueta del teléfono */}
            <input
              id="customerPhone" // id del input
              name="customerPhone" // nombre del campo
              type="text" // tipo texto
              required // campo obligatorio
              className="w-full rounded-lg border px-4 py-3" // estilos del input
            />
          </div>

          <div> {/* grupo del campo mensaje */}
            <label htmlFor="message" className="mb-2 block font-medium">Detalles de la cotización</label> {/* etiqueta del mensaje */}
            <textarea
              id="message" // id del textarea
              name="message" // nombre del campo
              required // campo obligatorio
              rows={5} // altura visible del área de texto
              className="w-full rounded-lg border px-4 py-3" // estilos del textarea
              placeholder={`Hola, quiero cotizar el producto "${product.name}".`} // texto sugerido para el usuario
            />
          </div>

          <button
            type="submit" // indica que el botón enviará el formulario
            className="rounded-lg bg-black px-5 py-3 text-white" // estilos del botón
          >
            Enviar cotización {/* texto del botón */}
          </button>
        </form>
      </div>
    </main>
  );
}