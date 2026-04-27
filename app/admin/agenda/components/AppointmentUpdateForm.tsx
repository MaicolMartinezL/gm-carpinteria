"use client";

import { useActionState } from "react";
import {
  updateAppointment,
  type UpdateAppointmentState,
} from "../actions";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type AppointmentUpdateFormProps = {
  appointmentId: number;
  currentStatus: AppointmentStatus;
};

const initialState: UpdateAppointmentState = {};

export default function AppointmentUpdateForm({
  appointmentId,
  currentStatus,
}: AppointmentUpdateFormProps) {
  const [state, action, pending] = useActionState(
    updateAppointment,
    initialState
  );

  return (
    <form action={action} className="mt-4 space-y-4 rounded-lg border p-4">
      <input type="hidden" name="appointmentId" value={appointmentId} />

      <div>
        <label htmlFor={`status-${appointmentId}`} className="mb-2 block text-sm font-medium">
          Estado
        </label>
        <select
          id={`status-${appointmentId}`}
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-lg border px-4 py-3"
        >
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {state?.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      {state?.success ? (
        <p className="text-sm text-green-600">{state.success}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar estado"}
      </button>
    </form>
  );
}