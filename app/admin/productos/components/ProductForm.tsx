"use client";

import { useActionState } from "react";
import type { ProductState } from "../actions";

type CategoryOption = {
  id: number;
  name: string;
};

type ProductFormProps = {
  action: (
    state: ProductState | void,
    formData: FormData
  ) => Promise<ProductState | void>;
  categories: CategoryOption[];
  defaultValues?: {
    id?: number;
    name?: string;
    description?: string;
    material?: string | null;
    color?: string | null;
    priceBase?: number;
    categoryId?: number;
    imageUrl?: string;
    active?: boolean;
  };
  submitLabel: string;
};

const initialState: ProductState = {};

export default function ProductForm({
  action,
  categories,
  defaultValues,
  submitLabel,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-xl border p-6 shadow-sm">
      {defaultValues?.id ? (
        <input type="hidden" name="productId" value={defaultValues.id} />
      ) : null}

      <div>
        <label htmlFor="name" className="mb-2 block font-medium">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name || ""}
          className="w-full rounded-lg border px-4 py-3"
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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="material" className="mb-2 block font-medium">
            Material
          </label>
          <input
            id="material"
            name="material"
            type="text"
            defaultValue={defaultValues?.material || ""}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="color" className="mb-2 block font-medium">
            Color
          </label>
          <input
            id="color"
            name="color"
            type="text"
            defaultValue={defaultValues?.color || ""}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="priceBase" className="mb-2 block font-medium">
            Precio base
          </label>
          <input
            id="priceBase"
            name="priceBase"
            type="number"
            min="1"
            step="0.01"
            required
            defaultValue={defaultValues?.priceBase || ""}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-2 block font-medium">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={defaultValues?.categoryId || ""}
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="mb-2 block font-medium">
          URL de imagen principal
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          defaultValue={defaultValues?.imageUrl || ""}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="/placeholder-product.jpg"
        />
      </div>

      {typeof defaultValues?.active === "boolean" ? (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            defaultChecked={defaultValues.active}
          />
          <span>Producto activo</span>
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