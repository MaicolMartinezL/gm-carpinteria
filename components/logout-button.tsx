"use client";

import { useTransition } from "react";
import { logout } from "@/app/actions/auth";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => logout())}
      disabled={pending}
      className="transition hover:text-gray-700 disabled:opacity-50"
    >
      {pending ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}