"use client";
import { useState, useEffect } from "react";

export default function ToggleButton({ deviceId, initial = false, disabled, onToggle }) {
  const [isOn, setIsOn] = useState(initial);
  const [loading, setLoading] = useState(false);

  // Sincroniza el estado interno con el prop `initial` cuando cambia
  useEffect(() => {
    setIsOn(initial);
  }, [initial]);

  const handleClick = async () => {
    if (disabled || loading) return; // evita doble click

    const newState = !isOn;
    setIsOn(newState); // Cambio visual inmediato
    setLoading(true);

    try {
      if (onToggle) {
        await onToggle(newState); // Llama a la función pasada por props
      }
    } catch (err) {
      console.error("❌ Error al cambiar estado:", err);
      setIsOn(!newState); // Revertir cambio si falla
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 rounded-full font-bold transition-all cursor-pointer
        flex items-center justify-center
        text-white
        ${isOn 
          ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700" 
          : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        }
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "..." : isOn ? "ON" : "OFF"}
    </button>
  );
}
