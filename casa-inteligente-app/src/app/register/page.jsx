"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Lock, Mail } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  //FUNCIÓN PARA ENVIAR LOS DATOS AL BACKEND
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email: correo,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Cuenta creada correctamente");
        router.push("/login"); // redirige al login
      } else {
        alert("❌ Error: " + (data.message || "No se pudo crear la cuenta"));
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden text-white">
      <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_#2b47ff_0%,_#8a2be2_35%,_transparent_70%)] opacity-60 blur-3xl"></div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl relative z-10 px-6">
        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left w-full md:w-1/2 space-y-6">
          <h1 className="text-6xl font-extrabold">¡Crea tu cuenta!</h1>
          <p className="text-gray-300 text-lg max-w-md">
            Únete para gestionar tus recursos y servicios fácilmente
          </p>
          <img
            src="/Login/login-illustration.webp"
            alt="Ilustración de registro"
            className="w-80 md:w-[350px] mt-8 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl w-full md:w-[420px] p-10 mt-10 md:mt-0">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <UserPlus size={40} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Registrarse</h2>
            <p className="text-gray-500 mt-2 text-center">
              Completa tus datos para crear tu cuenta
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">
                Nombre de usuario
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <UserPlus className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">
                Correo electrónico
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <Mail className="text-gray-400 mr-2" size={18} />
                <input
                  type="email"
                  placeholder="Tu correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">
                Contraseña
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <Lock className="text-gray-400 mr-2" size={18} />
                <input
                  type="password"
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                />
              </div>
              <p
                onClick={() => router.push("/login")}
                className="text-right text-sm text-blue-500 mt-2 cursor-pointer hover:underline"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg transition-colors cursor-pointer"
            >
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
