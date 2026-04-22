"use client";

import { useActionState } from "react";
import { createContactMessage, type ContactState } from "../actions";

const initialState: ContactState = {};

export default function ContactForm() {
  const [state, action, pending] = useActionState(
    createContactMessage,
    initialState
  );

  return (
    <form action={action} className="space-y-5 rounded-xl border p-6 shadow-sm">
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
        <label htmlFor="message" className="mb-2 block font-medium">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Escribe tu consulta aquí."
        />
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      {state?.success ? (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}