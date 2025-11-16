"use client";

import useUser from "../../cookie/page";

export default function Page() {  
  const user = useUser(); // <-- AQUÍ ejecutamos el hook

  return (
    <div>
      <h1 className="text-3xl font-bold">Inicio</h1>

      <p className="text-gray-500">
        Bienvenido a tu casa inteligente {user?.nombre || ""}
      </p>
    </div>
  );
}

