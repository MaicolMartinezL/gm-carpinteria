import Link from "next/link";
import RegisterForm from "./ui/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-md rounded-2xl border p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-sm text-gray-600">
          Regístrate para hacer seguimiento a tus cotizaciones.
        </p>

        <RegisterForm />

        <p className="mt-6 text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}