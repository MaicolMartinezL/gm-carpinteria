"use client";

import { useActionState } from "react";
import {
  updateQuote,
  type UpdateQuoteState,
} from "../actions";

type QuoteStatus = "NEW" | "IN_PROGRESS" | "RESPONDED" | "CLOSED";

type QuoteUpdateFormProps = {
  quoteId: number;
  currentStatus: QuoteStatus;
  currentResponse: string | null;
};

const initialState: UpdateQuoteState = {};

export default function QuoteUpdateForm({
  quoteId,
  currentStatus,
  currentResponse,
}: QuoteUpdateFormProps) {
  const [state, action, pending] = useActionState(updateQuote, initialState);

  return (
    <form action={action} className="mt-4 space-y-4 rounded-lg border p-4">
      <input type="hidden" name="quoteId" value={quoteId} />

      <div>
        <label htmlFor={`status-${quoteId}`} className="mb-2 block text-sm font-medium">
          Estado
        </label>
        <select
          id={`status-${quoteId}`}
          name="status"
          defaultValue={currentStatus}
          className="w-full rounded-lg border px-4 py-3"
        >
          <option value="NEW">NEW</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESPONDED">RESPONDED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`adminResponse-${quoteId}`}
          className="mb-2 block text-sm font-medium"
        >
          Respuesta al cliente
        </label>
        <textarea
          id={`adminResponse-${quoteId}`}
          name="adminResponse"
          defaultValue={currentResponse || ""}
          rows={4}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Escribe una observación o respuesta para el cliente."
        />
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
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}