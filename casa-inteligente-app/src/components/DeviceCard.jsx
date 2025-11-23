"use client";
import { useState, useEffect } from "react";
import ToggleButton from "./ToggleButton";

export default function DeviceCard({ id, name, tipo = "led" }) {
  const [state, setState] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false); 
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Identificadores
  const isGarage = id === "p4"; 
  const isManualDoor = tipo === "manual"; // p1, p2, p3, p5 (Puerta Principal)
  const isLed = tipo === "led";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        let res, data;

        if (isLed) {
          res = await fetch("http://localhost:5000/led/status");
          data = await res.json();
          if (res.ok && data[id] !== undefined) setState(data[id]);

        } else if (isManualDoor) {
          res = await fetch("http://localhost:5000/door/status");
          data = await res.json();
          if (res.ok && data[id] !== undefined) setState(data[id]);

        } else if (isGarage) {
          res = await fetch("http://localhost:5000/garage/status");
          data = await res.json();
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

    let interval = null;
    if (isGarage) interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);

  }, [id, tipo]);

  const handleToggle = async (newState) => {
    if (isGarage) return;

    setLoading(true);
    setError(null);

    try {
      let url = "";

      if (isLed) {
        url = `http://localhost:5000/led/${id}/${newState ? "on" : "off"}`;
      } else if (isManualDoor) {
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

          {isGarage ? (
            <>
              <p className={`text-lg font-bold ${doorOpen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {doorOpen ? "Abierta" : "Cerrada"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Distancia: {distance !== null ? `${distance} cm` : "--"}
              </p>
            </>
          ) : (
            <p className={`text-lg font-bold ${state ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {isLed ? (state ? "Encendido" : "Apagado") : (state ? "Abierta" : "Cerrada")}
            </p>
          )}
        </div>

        {!isGarage && !tipo.includes("sensor") && (
          <ToggleButton
            deviceId={id}
            initial={state}
            disabled={loading}
            onToggle={handleToggle}
          />
        )}
      </div>

      {error && <p className="text-red-500 dark:text-red-400 text-xs mt-3">⚠️ {error}</p>}
    </div>
  );
}
