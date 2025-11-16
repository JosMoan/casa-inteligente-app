"use client";
import { useState, useEffect } from "react";
import ToggleButton from "./ToggleButton";

export default function DeviceCard({ id, name }) {
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/led/status");
        const data = await res.json();

        if (res.ok) {
          setState(data[id]);
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
    <div
      className="
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        p-6 rounded-2xl shadow-md
        border border-gray-300 dark:border-gray-700
        transition-all duration-300
        hover:shadow-lg dark:hover:shadow-gray-900/40
        w-full max-w-sm
      "
    >
      <h3 className="text-xl font-semibold mb-2">
        {name}
      </h3>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        ID: {id}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Estado actual:
          </p>

          <p
            className={`
              text-lg font-bold transition-colors
              ${state ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
            `}
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

      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-3">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
