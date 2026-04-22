"use client";

import { useTransition } from "react";
import { deleteProduct } from "../actions";

type Props = {
  productId: number;
};

export default function DeleteProductButton({ productId }: Props) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );

    if (!confirmed) return;

    const formData = new FormData();
    formData.append("productId", productId.toString());

    startTransition(() => {
      deleteProduct(formData);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
    >
      {pending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}