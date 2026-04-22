export function getQuoteStatusLabel(status: string) {
  switch (status) {
    case "NEW":
      return "Nueva";
    case "IN_PROGRESS":
      return "En proceso";
    case "RESPONDED":
      return "Respondida";
    case "CLOSED":
      return "Cerrada";
    default:
      return status;
  }
}

export function getAppointmentStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "CONFIRMED":
      return "Confirmada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
}