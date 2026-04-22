"use client";

import { useActionState, useEffect, useState } from "react";
import { createAppointment, type AppointmentState } from "../actions";

const initialState: AppointmentState = {};

type AppointmentFormProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
};

export default function AppointmentForm({ user }: AppointmentFormProps) {
  const [state, action, pending] = useActionState(createAppointment, initialState);
  const [date, setDate] = useState("");
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    setMinDate(localDate);
  }, []);

  return (
    <form action={action} className="space-y-5 rounded-xl border p-6 shadow-sm">
      <div>
        <label htmlFor="customerName" className="mb-2 block font-medium">
          Nombre completo
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          required
          defaultValue={user?.name || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="customerEmail" className="mb-2 block font-medium">
          Correo electrónico
        </label>
        <input
          id="customerEmail"
          name="customerEmail"
          type="email"
          required
          defaultValue={user?.email || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="customerPhone" className="mb-2 block font-medium">
          Teléfono
        </label>
        <input
          id="customerPhone"
          name="customerPhone"
          type="text"
          defaultValue={user?.phone || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-2 block font-medium">
            Fecha
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="time" className="mb-2 block font-medium">
            Hora
          </label>
          <select
            id="time"
            name="time"
            required
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="">Selecciona una hora</option>
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block font-medium">
          Detalles de la asesoría
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Cuéntanos qué necesitas para prepararnos mejor."
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
        {pending ? "Agendando..." : "Agendar asesoría"}
      </button>
    </form>
  );
}