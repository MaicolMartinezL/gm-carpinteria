"use client"; // indica que este componente corre en el cliente porque usa hooks

import { useActionState } from "react"; // importa el hook para manejar el estado de la acción
import { login } from "@/app/actions/auth"; // importa la acción de login

export default function LoginForm() { // crea el componente del formulario
  const [state, action, pending] = useActionState(login, undefined); // conecta el formulario con la acción del servidor

  return (
    <form action={action} className="mt-6 space-y-4"> {/* formulario que ejecuta la acción login */}
      <div> {/* grupo del campo email */}
        <label htmlFor="email" className="mb-2 block font-medium">Correo</label> {/* etiqueta del campo */}
        <input
          id="email" // id del input
          name="email" // nombre que llegará al FormData
          type="email" // tipo email
          required // campo obligatorio
          className="w-full rounded-lg border px-4 py-3" // estilos del input
        />
      </div>

      <div> {/* grupo del campo contraseña */}
        <label htmlFor="password" className="mb-2 block font-medium">Contraseña</label> {/* etiqueta del campo */}
        <input
          id="password" // id del input
          name="password" // nombre que llegará al FormData
          type="password" // tipo password
          required // campo obligatorio
          className="w-full rounded-lg border px-4 py-3" // estilos del input
        />
      </div>

      {state?.error ? ( // verifica si existe un error devuelto por la acción
        <p className="text-sm text-red-600">{state.error}</p> // muestra el error
      ) : null}

      <button
        type="submit" // indica que el botón envía el formulario
        disabled={pending} // desactiva el botón mientras se procesa
        className="w-full rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50" // estilos del botón
      >
        {pending ? "Ingresando..." : "Ingresar"} {/* cambia el texto mientras carga */}
      </button>
    </form>
  );
}
