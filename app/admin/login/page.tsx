import LoginForm from "./ui/LoginForm"; // importa el componente del formulario de login

export default function AdminLoginPage() { // crea la página de login del administrador
  return ( // retorna la interfaz visual
    <main className="min-h-screen p-8"> {/* contenedor principal con altura mínima de pantalla y padding */}
      <div className="mx-auto max-w-md rounded-2xl border p-8 shadow-sm"> {/* caja centrada para el formulario */}
        <h1 className="text-3xl font-bold">Login de administrador</h1> {/* título principal */}
        <p className="mt-2 text-sm text-gray-600">Ingresa con tu cuenta admin para gestionar cotizaciones.</p> {/* texto de ayuda */}
        <LoginForm /> {/* renderiza el formulario de login */}
      </div>
    </main>
  );
}