"use client";
import { useState, useEffect } from "react";
import ToggleButton from "./ToggleButton";

export default function DeviceCard({ id, name }) {
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener estado actual desde backend
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/led/status");
        const data = await res.json();

        if (res.ok) {
          if (id === "cochera") setState(data.cochera);
          else if (id === "cocina") setState(data.cocina);
          else if (id === "dor1") setState(data.dor1);
          else if (id === "dor2") setState(data.dor2); // ✅ agregado
          else if (id === "sala") setState(data.sala); // ✅ agregado
          else if (id === "bano") setState(data.bano); // ✅ agregado
        }
      } catch (err) {
        console.error("❌ Error al obtener estado del LED:", err);
      }
    };
    fetchStatus();
  }, [id]);

  const handleToggle = async (newState) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:5000/led/${id}/${newState ? "on" : "off"}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (res.ok && data.status === "ok") {
        setState(newState);
      } else {
        throw new Error(data.message || "Error al cambiar estado del dispositivo");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("No se pudo conectar al dispositivo");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80 transition-transform hover:scale-105 duration-200">
      <h3 className="text-xl font-semibold mb-2 text-white">{name}</h3>
      <p className="mb-4 text-sm text-gray-400">ID: {id}</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">Estado actual:</p>
          <p
            className={`text-lg font-bold transition-colors duration-300 ${
              state ? "text-green-400" : "text-red-400"
            }`}
          >
            {state ? "Encendido" : "Apagado"}
          </p>
        </div>

        <ToggleButton
          deviceId={id}
          initial={state}
          disabled={loading}
          onToggle={handleToggle}
        />
      </div>

      {error && <p className="text-red-400 text-xs mt-3">⚠️ {error}</p>}
    </div>
  );
}
