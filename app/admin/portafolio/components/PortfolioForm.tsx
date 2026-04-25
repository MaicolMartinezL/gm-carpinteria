"use client";

import { useActionState } from "react";
import type { PortfolioState } from "../actions";

type PortfolioFormProps = {
  action: (
    state: PortfolioState | void,
    formData: FormData
  ) => Promise<PortfolioState | void>;
  initialState?: PortfolioState;
  defaultValues?: {
    id?: number;
    title?: string;
    category?: string;
    description?: string;
    location?: string | null;
    projectDate?: string;
    imageUrl?: string;
    active?: boolean;
  };
  submitLabel: string;
};

const stateDefault: PortfolioState = {};

export default function PortfolioForm({
  action,
  initialState = stateDefault,
  defaultValues,
  submitLabel,
}: PortfolioFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-xl border p-6 shadow-sm">
      {defaultValues?.id ? (
        <input type="hidden" name="projectId" value={defaultValues.id} />
      ) : null}

      <div>
        <label htmlFor="title" className="mb-2 block font-medium">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-2 block font-medium">
          Categoría
        </label>
        <input
          id="category"
          name="category"
          type="text"
          required
          defaultValue={defaultValues?.category || ""}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Ej: Cocinas, Salas, Closets"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block font-medium">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={defaultValues?.description || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="location" className="mb-2 block font-medium">
          Ubicación
        </label>
        <input
          id="location"
          name="location"
          type="text"
          defaultValue={defaultValues?.location || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="projectDate" className="mb-2 block font-medium">
          Fecha del proyecto
        </label>
        <input
          id="projectDate"
          name="projectDate"
          type="date"
          defaultValue={defaultValues?.projectDate || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="imageUrls" className="mb-2 block font-medium">
          URLs de imágenes
        </label>
        <textarea
          id="imageUrls"
          name="imageUrls"
          rows={4}
          defaultValue={defaultValues?.imageUrl || ""}
          className="w-full rounded-lg border px-4 py-3"
          placeholder={`/portfolio/cocina-familiar-1.jpg
      /portfolio/cocina-familiar-2.jpg
      /portfolio/cocina-familiar-3.jpg`}
        />
        <p className="mt-2 text-sm text-gray-500">
          Escribe una imagen por línea. La primera será la imagen principal.
        </p>
      </div>

      {typeof defaultValues?.active === "boolean" ? (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            defaultChecked={defaultValues.active}
          />
          <span>Proyecto activo</span>
        </label>
      ) : null}

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
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}