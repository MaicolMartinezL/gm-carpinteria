"use client"; // indica que este componente corre en el cliente

import { useTransition } from "react"; // importa hook para manejar estado de carga
import { logout } from "@/app/actions/auth"; // importa la acción de logout

export default function LogoutButton() { // crea el botón de cerrar sesión
  const [pending, startTransition] = useTransition(); // crea estado de transición

  return (
    <button
      onClick={() => startTransition(() => logout())} // ejecuta logout al hacer clic
      disabled={pending} // desactiva el botón mientras procesa
      className="rounded-lg border px-4 py-2" // estilos del botón
    >
      {pending ? "Saliendo..." : "Cerrar sesión"} {/* cambia el texto mientras procesa */}
    </button>
  );
}