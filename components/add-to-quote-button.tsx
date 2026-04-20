"use client";

import { useMemo, useState } from "react";

type AddToQuoteButtonProps = {
  product: {
    id: number;
    slug: string;
    name: string;
    priceBase: number;
    imageUrl?: string | null;
  };
};

type StoredQuoteProduct = {
  id: number;
  slug: string;
  name: string;
  priceBase: number;
  imageUrl?: string | null;
};

const STORAGE_KEY = "gm_quote_products";

export default function AddToQuoteButton({
  product,
}: AddToQuoteButtonProps) {
  const [message, setMessage] = useState("");

  const buttonLabel = useMemo(() => {
    return message || "Agregar a cotización";
  }, [message]);

  function handleAdd() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const current: StoredQuoteProduct[] = raw ? JSON.parse(raw) : [];

      const alreadyExists = current.some((item) => item.id === product.id);

      if (alreadyExists) {
        setMessage("Ya está en la selección");
        window.setTimeout(() => setMessage(""), 2000);
        return;
      }

      const updated = [...current, product];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setMessage("Producto agregado");
      window.setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("No se pudo guardar");
      window.setTimeout(() => setMessage(""), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="rounded-lg border px-5 py-3"
    >
      {buttonLabel}
    </button>
  );
}