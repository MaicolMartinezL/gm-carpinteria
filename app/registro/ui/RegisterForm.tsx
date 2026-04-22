"use client";

import { useActionState } from "react";
import { register, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = {};

export default function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialState);

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="mb-2 block font-medium">
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block font-medium">
          Teléfono
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block font-medium">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block font-medium">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      {state?.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Creando cuenta..." : "Registrarme"}
      </button>
    </form>
  );
}