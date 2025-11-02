"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DeviceCard from "@/components/DeviceCard";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([
    { id: "cochera", name: "Luz Cochera", initial: false },
    { id: "cocina", name: "Luz Cocina", initial: false },
    { id: "dor1", name: "Dormitorio 1", initial: false },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) router.push("/login");
    else setUser(JSON.parse(storedUser));
  }, [router]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Panel de control {user && <span className="text-blue-400">{user.nombre}</span>}
          </h2>
          <p className="text-gray-400 mb-10">
            Controla los dispositivos de tu casa inteligente
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map(d => (
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
    </>
  );
}
