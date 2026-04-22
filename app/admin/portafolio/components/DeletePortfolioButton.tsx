"use client";

import { useTransition } from "react";
import { deletePortfolioProject } from "../actions";

type Props = {
  projectId: number;
};

export default function DeletePortfolioButton({ projectId }: Props) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este proyecto?"
    );

    if (!confirmed) return;

    const formData = new FormData();
    formData.append("projectId", projectId.toString());

    startTransition(() => {
      deletePortfolioProject(formData);
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