"use client"; // indica que este componente se ejecuta en el cliente porque usa estado e interacción

import { useState } from "react"; // importa useState para manejar el valor del slug y del nombre
import { generateSlug } from "@/lib/slug"; // importa la función que genera slugs automáticamente

type Category = { // define el tipo de una categoría
  id: number; // id único de la categoría
  name: string; // nombre de la categoría
};

type ProductCreateFormProps = { // define las props del componente
  categories: Category[]; // lista de categorías disponibles
  action: (formData: FormData) => Promise<void>; // server action que guardará el producto
};

export default function ProductCreateForm({ categories, action }: ProductCreateFormProps) { // crea el componente del formulario
  const [name, setName] = useState(""); // guarda el nombre escrito por el usuario
  const [slug, setSlug] = useState(""); // guarda el slug generado o editado

  return (
    <form action={action} className="mt-8 space-y-5"> {/* formulario que ejecuta la server action */}
      <div> {/* grupo del nombre */}
        <label htmlFor="name" className="mb-2 block font-medium">Nombre</label> {/* etiqueta del nombre */}
        <input
          id="name" // id del input
          name="name" // nombre enviado al servidor
          type="text" // tipo texto
          required // campo obligatorio
          value={name} // valor controlado del nombre
          onChange={(e) => { // se ejecuta cuando cambia el input
            const value = e.target.value; // toma el valor escrito
            setName(value); // actualiza el estado del nombre
            setSlug(generateSlug(value)); // genera y actualiza el slug automáticamente
          }}
          className="w-full rounded-lg border px-4 py-3" // estilos del input
        />
      </div>

      <div> {/* grupo del slug */}
        <label htmlFor="slug" className="mb-2 block font-medium">Slug</label> {/* etiqueta del slug */}
        <input
          id="slug" // id del input
          name="slug" // nombre enviado al servidor
          type="text" // tipo texto
          required // campo obligatorio
          value={slug} // valor controlado del slug
          onChange={(e) => setSlug(generateSlug(e.target.value))} // permite editarlo manualmente y lo normaliza
          className="w-full rounded-lg border px-4 py-3" // estilos del input
        />
      </div>

      <div> {/* grupo de descripción */}
        <label htmlFor="description" className="mb-2 block font-medium">Descripción</label> {/* etiqueta */}
        <textarea
          id="description" // id del textarea
          name="description" // nombre enviado al servidor
          required // campo obligatorio
          rows={5} // altura visible
          className="w-full rounded-lg border px-4 py-3" // estilos
        />
      </div>

      <div> {/* grupo de precio */}
        <label htmlFor="price" className="mb-2 block font-medium">Precio</label> {/* etiqueta */}
        <input
          id="price" // id del input
          name="price" // nombre enviado al servidor
          type="number" // tipo numérico
          step="0.01" // permite decimales
          required // campo obligatorio
          className="w-full rounded-lg border px-4 py-3" // estilos
        />
      </div>

      <div> {/* grupo de categoría */}
        <label htmlFor="categoryId" className="mb-2 block font-medium">Categoría</label> {/* etiqueta */}
        <select
          id="categoryId" // id del select
          name="categoryId" // nombre enviado al servidor
          required // campo obligatorio
          className="w-full rounded-lg border px-4 py-3" // estilos
        >
          <option value="">Selecciona una categoría</option> {/* opción inicial */}
          {categories.map((category) => ( // recorre categorías
            <option key={category.id} value={category.id}> {/* opción por categoría */}
              {category.name} {/* nombre visible */}
            </option>
          ))}
        </select>
      </div>

      <div> {/* grupo de imagen */}
        <label htmlFor="imageUrl" className="mb-2 block font-medium">URL de imagen (opcional)</label> {/* etiqueta */}
        <input
          id="imageUrl" // id del input
          name="imageUrl" // nombre enviado al servidor
          type="text" // tipo texto
          className="w-full rounded-lg border px-4 py-3" // estilos
        />
      </div>

      <button
        type="submit" // envía el formulario
        className="rounded-lg bg-black px-5 py-3 text-white" // estilos del botón
      >
        Guardar producto {/* texto del botón */}
      </button>
    </form>
  );
}