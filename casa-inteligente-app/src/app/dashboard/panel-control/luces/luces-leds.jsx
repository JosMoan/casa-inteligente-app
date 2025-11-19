"use client";
import { useEffect, useState } from "react";
import DeviceCard from "../../../../components/DeviceCard";

export default function LucesLeds() {
  const [user, setUser] = useState(null);

  const [devices, setDevices] = useState([
    { id: "cochera", name: "Luz Cochera", initial: false },
    { id: "cocina", name: "Luz Cocina", initial: false },
    { id: "dor1", name: "Dormitorio 1", initial: false },
    { id: "dor2", name: "Dormitorio 2", initial: false },
    { id: "sala", name: "Sala", initial: false },
    { id: "bano", name: "Baño", initial: false },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <main
      className="
        w-full h-full 
        transition-colors duration-300
        bg-transparent
      "
    >
      <div className="px-6 pt-6">

        <h2 className="text-3xl font-bold mb-4">
          Control de luces{" "}
          {user && (
            <span className="text-blue-600 dark:text-blue-400">
              {user.nombre}
            </span>
          )}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Controla los dispositivos de tu casa inteligente
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((d) => (
            <DeviceCard
              key={d.id}
              id={d.id}
              name={d.name}
              initialState={d.initial}
            />
          ))}
        </div>

      </div>
    </main>
  );
}
