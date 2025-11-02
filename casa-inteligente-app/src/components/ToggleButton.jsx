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
      className={`px-4 py-2 rounded-full text-white font-bold transition-colors ${
        isOn ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {isOn ? "ON" : "OFF"}
    </button>
  );
}
