"use client";
import { useState, useEffect } from "react";
import ToggleButton from "./ToggleButton";

export default function DeviceCard({ id, name, tipo = "led" }) {
  const [state, setState] = useState(false);       // LED o puerta
  const [doorOpen, setDoorOpen] = useState(false); // solo para cochera
  const [distance, setDistance] = useState(null);  // solo para cochera
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (tipo === "led") {
          const res = await fetch("http://localhost:5000/led/status");
          const data = await res.json();
          if (res.ok) setState(data[id]);
        } else if (tipo === "manual") {
          const res = await fetch("http://localhost:5000/door/status");
          const data = await res.json();
          if (res.ok) setState(data[id]);
        } else if (id === "p4") {
          // Tarjeta cochera -> Arduino esclavo
          const res = await fetch("http://localhost:5000/garage/status");
          const data = await res.json();
          if (res.ok) {
            setDoorOpen(data.door_open);
            setDistance(data.distance_cm);
          }
        }
      } catch (err) {
        console.error("❌ Error al obtener estado:", err);
        setError("No se pudo obtener el estado");
      }
    };

    fetchStatus();

    // Actualizar cada 2 segundos si es cochera o sensor
    let interval = null;
    if (tipo === "sensor" || id === "p4") {
      interval = setInterval(fetchStatus, 2000);
    }
    return () => clearInterval(interval);
  }, [id, tipo]);

  const handleToggle = async (newState) => {
    if (tipo === "sensor" || id === "p4") return;

    setLoading(true);
    setError(null);

    try {
      let url = "";
      if (tipo === "led") {
        url = `http://localhost:5000/led/${id}/${newState ? "on" : "off"}`;
      } else if (tipo === "manual") {
        url = `http://localhost:5000/door/${id}/${newState ? "open" : "close"}`;
      }

      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      if (res.ok && data.status === "ok") setState(newState);
      else throw new Error(data.message || "Error al cambiar estado");
    } catch (err) {
      console.error("❌ Error:", err);
      setError("No se pudo conectar al dispositivo");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-md border border-gray-300 dark:border-gray-700 w-full max-w-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/40">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">ID: {id}</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado actual:</p>
          {id === "p4" ? (
            <>
              <p className={`text-lg font-bold transition-colors ${doorOpen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {doorOpen ? "Abierta" : "Cerrada"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Distancia: {distance !== null ? `${distance} cm` : "--"}
              </p>
            </>
          ) : (
            <p className={`text-lg font-bold transition-colors ${state ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {tipo === "led" ? (state ? "Encendido" : "Apagado") : (state ? "Abierta" : "Cerrada")}
            </p>
          )}
        </div>

        {tipo !== "sensor" && id !== "p4" && (
          <ToggleButton deviceId={id} initial={state} disabled={loading} onToggle={handleToggle} />
        )}
      </div>

      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-3">⚠️ {error}</p>}
    </div>
  );
}
