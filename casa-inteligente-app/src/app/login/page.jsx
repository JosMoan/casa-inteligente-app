"use client";
import { useState } from "react";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Error en el inicio de sesión");
      }

      // Guardar usuario logueado (desde BD)
      localStorage.setItem("user", JSON.stringify(data.usuario));

      router.push("/dashboard");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden text-white">
      {/* Fondo efecto radial */}
      <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_#2b47ff_0%,_#8a2be2_35%,_transparent_70%)] opacity-60 blur-3xl"></div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl relative z-10 px-6">
        {/* Ilustración */}
        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left w-full md:w-1/2 space-y-6">
          <h1 className="text-6xl font-extrabold">¡Bienvenido!</h1>
          <p className="text-gray-300 text-lg max-w-md">
            Accede a tu cuenta para gestionar tu casa inteligente
          </p>
          <img
            src="/Login/login-illustration.webp"
            alt="Ilustración"
            className="w-80 md:w-[350px] mt-8 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          />
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl w-full md:w-[420px] p-10 mt-10 md:mt-0">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <User size={40} className="text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Correo */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">
                Correo electrónico
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo"
                  className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">
                Contraseña
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <Lock className="text-gray-400 mr-2" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Botón de login */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>

          {/*Enlace al registro */}
          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tienes una cuenta?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
