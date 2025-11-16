"use client";
import { useState, useEffect } from "react";

export default function ToggleButton({ deviceId, initial = false, disabled, onToggle }) {
  const [isOn, setIsOn] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsOn(initial);
  }, [initial]);

  const handleClick = async () => {
    const newState = !isOn;
    setIsOn(newState);
    setLoading(true);

    if (onToggle) await onToggle(newState);

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
