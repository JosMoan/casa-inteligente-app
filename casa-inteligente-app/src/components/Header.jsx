"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Al cargar el componente, obtenemos los datos del usuario
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Convertimos el string a objeto
    } else {
      // si no hay usuario, redirigimos al login
      router.push("/login");
    }
  }, [router]);

  //Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-4 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-bold">Casa Inteligente</h1>
        <nav className="flex items-center gap-4">
          {/*Mostramos el nombre solo si el usuario está cargado */}
          <span className="text-sm opacity-90">
            Bienvenido, {user?.nombre || "Cargando..."}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md transition"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}
