"use client";

import { useState } from "react";

export default function ChatbotSection() {
  const [messages, setMessages] = useState([
    { role: "ia", text: "Hola, soy tu IA local. ¿En qué te ayudo?" },
  ]);

  const [input, setInput] = useState("");

  const enviarMensaje = async () => {
    if (!input.trim()) return;

    const nuevoMensaje = { role: "user", text: input };
    setMessages((prev) => [...prev, nuevoMensaje]);

    const userInput = input;
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/ia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      const data = await response.json();

      const respuestaIA = {
        role: "ia",
        text: data.reply || "La IA no dio respuesta",
      };

      setMessages((prev) => [...prev, respuestaIA]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ia", text: "Error conectando con la IA ⚠" },
      ]);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-2xl border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800">🤖 Chatbot</h1>
      <p className="text-gray-500 mb-4 text-sm">
        Asistente virtual para tu casa inteligente
      </p>

      {/* Chat */}
      <div className="h-80 overflow-y-auto p-4 bg-gray-50 rounded-xl border space-y-3">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow 
              ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-green-600 text-white rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex mt-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-300 p-3 flex-grow rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={enviarMensaje}
          className="bg-blue-600 hover:bg-blue-700 transition px-4 text-white rounded-xl text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
