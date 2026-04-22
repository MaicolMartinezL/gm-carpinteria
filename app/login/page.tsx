import Link from "next/link";
import LoginForm from "./ui/LoginForm";

export default function ClientLoginPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-md rounded-2xl border p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-gray-600">
          Ingresa para consultar tus cotizaciones y solicitudes.
        </p>

        <LoginForm />

        <p className="mt-6 text-sm text-gray-600">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className="font-medium underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}