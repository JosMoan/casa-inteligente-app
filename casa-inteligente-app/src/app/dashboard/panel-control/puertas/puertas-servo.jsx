"use client";

import DeviceCard from "../../../../components/DeviceCard";

export default function PanelPuertas() {
  const puertas = [
    { id: "p1", name: "Puerta Dormitorio1", tipo: "manual" },
    { id: "p2", name: "Puerta Dormitorio2", tipo: "manual" },
    { id: "p3", name: "Puerta Baño", tipo: "manual" },
    { id: "p4", name: "Puerta Cochera", tipo: "sensor" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8">Control de Puertas</h2>

      {/* Grid más centrado y con gap uniforme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 justify-items-center">
        {puertas.map((puerta) => (
          <div key={puerta.id} className="w-full max-w-sm">
            <DeviceCard
              id={puerta.id}
              name={puerta.name}
              tipo={puerta.tipo}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
