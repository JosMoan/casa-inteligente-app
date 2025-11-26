"use client";
import { useEffect, useState } from "react";

export default function DashboardHUD() {
  const [time, setTime] = useState(new Date());
  const [dhtData, setDhtData] = useState({ temperatura: 0, humedad: 0 });

  // Actualizar reloj cada segundo
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch de datos DHT cada 2 segundos
  useEffect(() => {
    const fetchDHT = setInterval(() => {
      fetch("http://10.43.96.185/DHT", { mode: "cors" })
        .then(res => res.text())
        .then(data => {
          // Dividir CSV: "23.2,67.9"
          const [temp, hum] = data.split(",");
          setDhtData({
            temperatura: parseFloat(temp) || 0,
            humedad: parseFloat(hum) || 0
          });
        })
        .catch(err => console.error("Error fetch DHT:", err));
    }, 2000);
    return () => clearInterval(fetchDHT);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourRotation = (hours % 12) * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6;

  return (
    <div className="text-white p-6 space-y-6">

      {/* RELOJ + CLIMA */}
      <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-6">

        {/* RELOJ DIGITAL + ANALÓGICO */}
        <div className="flex-1 space-y-4">
          <h2 className="text-teal-300 font-semibold text-lg">Reloj Inteligente HUD</h2>
          <div className="text-6xl font-bold">
            {hours}:{minutes.toString().padStart(2, "0")}
          </div>

          {/* Reloj Analógico */}
          <div className="w-40 h-40 border-4 border-teal-400 rounded-full relative mx-auto">
            <div
              className="absolute w-1 h-14 bg-teal-300 top-6 left-1/2 origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${hourRotation}deg)` }}
            ></div>
            <div
              className="absolute w-1 h-20 bg-white top-4 left-1/2 origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${minuteRotation}deg)` }}
            ></div>
            <div
              className="absolute w-[2px] h-24 bg-red-400 top-2 left-1/2 origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${secondRotation}deg)` }}
            ></div>
          </div>

          <p className="text-gray-300 text-center">
            {time.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* CLIMA */}
        <div className="flex-1 bg-gradient-to-r from-indigo-700/60 to-purple-700/50 p-6 rounded-2xl relative overflow-hidden">
          <h3 className="text-center text-xl font-semibold mb-2">Nublado</h3>
          <p className="text-center text-sm text-gray-200 mb-4">
            Cielo nublado - Humedad {dhtData.humedad.toFixed(1)}% - Viento 2km/h
          </p>

          {/* Pronóstico semanal */}
          <div className="grid grid-cols-5 gap-4">
            {["Lun", "Mar", "Mié", "Jue", "Vie"].map((d, i) => (
              <div key={i} className="text-center">
                <p className="text-sm">{d}</p>
                <div className="text-xs mt-2">22° / 30°</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL DE MÉTRICAS */}
      <div>
        <h2 className="text-lg text-gray-300 mb-3">Panel de métricas</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Energía */}
          <div className="bg-green-900/40 backdrop-blur-xl p-6 rounded-xl border border-green-500/30">
            <h3 className="text-sm">ENERGÍA (24H)</h3>
            <p className="text-3xl font-bold mt-2">320 kWh</p>
            <p className="text-xs text-gray-300">Consumo total reciente</p>
          </div>

          {/* Temperatura */}
          <div className="bg-red-900/40 backdrop-blur-xl p-6 rounded-xl border border-red-500/30">
            <h3 className="text-sm">TEMPERATURA</h3>
            <p className="text-3xl font-bold mt-2">{dhtData.temperatura.toFixed(1)}°C</p>
            <p className="text-xs text-gray-300">Promedio interior</p>
          </div>

          {/* Humedad */}
          <div className="bg-blue-900/40 backdrop-blur-xl p-6 rounded-xl border border-blue-500/30">
            <h3 className="text-sm">HUMEDAD</h3>
            <p className="text-3xl font-bold mt-2">{dhtData.humedad.toFixed(1)}%</p>
            <p className="text-xs text-gray-300">Hogar</p>
          </div>

          {/* Dispositivos */}
          <div className="bg-purple-900/40 backdrop-blur-xl p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-sm">DISPOSITIVOS</h3>
            <p className="text-3xl font-bold mt-2">2/3</p>
            <p className="text-xs text-gray-300">Estado activos</p>
          </div>

        </div>
      </div>
    </div>
  );
}
