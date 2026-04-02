export function generateSlug(text: string) { // crea una función para convertir texto en slug
  return text // empieza con el texto recibido
    .toLowerCase() // convierte todo a minúsculas
    .trim() // elimina espacios al inicio y al final
    .normalize("NFD") // separa letras de tildes para poder quitarlas
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes y acentos
    .replace(/[^a-z0-9\s-]/g, "") // elimina caracteres raros excepto letras, números, espacios y guiones
    .replace(/\s+/g, "-") // reemplaza uno o más espacios por un guion
    .replace(/-+/g, "-"); // evita múltiples guiones seguidos
}