"use client"; // indica que este componente se ejecuta en el cliente porque usará interacción del usuario

import { useTransition } from "react"; // importa un hook de React para manejar transiciones sin bloquear la interfaz

type QuoteStatusFormProps = { // define el tipo de propiedades que recibirá el componente
  quoteId: number; // id de la cotización que se va a actualizar
  currentStatus: string; // estado actual de la cotización
  onUpdate: (formData: FormData) => Promise<void>; // función que recibirá los datos del formulario para actualizar el estado
};

export default function QuoteStatusForm({ quoteId, currentStatus, onUpdate }: QuoteStatusFormProps) { // crea el componente reutilizable del formulario
  const [isPending, startTransition] = useTransition(); // crea un estado de transición para saber si la actualización está en proceso

  return (
    <form
      action={(formData) => { // define qué pasa cuando se envía el formulario
        startTransition(() => { // inicia una transición para no bloquear la interfaz
          onUpdate(formData); // ejecuta la función que actualiza el estado
        });
      }}
      className="flex items-center gap-2" // estilos del formulario para alinear select y botón
    >
      <input type="hidden" name="quoteId" value={quoteId} /> {/* envía ocultamente el id de la cotización */}

      <select
        name="status" // nombre del campo que se enviará al servidor
        defaultValue={currentStatus} // selecciona por defecto el estado actual
        className="rounded-md border px-2 py-1" // estilos del select
      >
        <option value="PENDIENTE">PENDIENTE</option> {/* opción 1 */}
        <option value="EN_PROCESO">EN_PROCESO</option> {/* opción 2 */}
        <option value="RESPONDIDA">RESPONDIDA</option> {/* opción 3 */}
      </select>

      <button
        type="submit" // indica que el botón envía el formulario
        disabled={isPending} // desactiva el botón mientras se actualiza
        className="rounded-md bg-black px-3 py-1 text-white disabled:opacity-50" // estilos del botón
      >
        {isPending ? "Guardando..." : "Guardar"} {/* cambia el texto según el estado de carga */}
      </button>
    </form>
  );
}