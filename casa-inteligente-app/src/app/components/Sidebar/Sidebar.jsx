"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ current, setCurrent, darkMode, setDarkMode }) {
    const router = useRouter();
    const [openPanel, closePanel] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <aside
            className={`w-64 h-screen p-6 shadow-md border-r flex flex-col transition-colors duration-300
                ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-200"}
            `}
        >
            <h2 className="text-2xl font-bold mb-10">Casa Inteligente</h2>

            <nav className="flex flex-col gap-3">

                <button
                    onClick={() => setCurrent("main")}
                    className={`px-3 py-2 text-left rounded-lg transition cursor-pointer ${
                        current === "main"
                            ? darkMode
                                ? "bg-gray-700 text-white font-semibold"
                                : "bg-blue-100 text-blue-700 font-semibold"
                            : darkMode
                                ? "hover:bg-gray-800"
                                : "hover:bg-gray-100"
                    }`}
                >
                    Inicio
                </button>

                <div>
                    <button
                        onClick={() => closePanel(!openPanel)}
                        className={`px-3 py-2 text-left rounded-lg w-full transition cursor-pointer ${
                            ["panel", "luces", "cochera", "puertas"].includes(current)
                                ? darkMode
                                    ? "bg-gray-700 text-white font-semibold"
                                    : "bg-blue-100 text-blue-700 font-semibold"
                                : darkMode
                                    ? "hover:bg-gray-800"
                                    : "hover:bg-gray-100"
                        }`}
                    >
                        Panel de control
                    </button>

                    {openPanel && (
                        <div className="flex flex-col ml-4 mt-2 gap-2">

                            <button
                                onClick={() => setCurrent("luces")}
                                className={`px-3 py-2 text-left rounded-lg transition cursor-pointer ${
                                    current === "luces"
                                        ? darkMode
                                            ? "bg-gray-700 text-white font-semibold"
                                            : "bg-blue-200 text-blue-800 font-semibold"
                                        : darkMode
                                            ? "hover:bg-gray-800"
                                            : "hover:bg-gray-100"
                                }`}
                            >
                                Luces LED
                            </button>

                            <button
                                onClick={() => setCurrent("cochera")}
                                className={`px-3 py-2 text-left rounded-lg transition cursor-pointer ${
                                    current === "cochera"
                                        ? darkMode
                                            ? "bg-gray-700 text-white font-semibold"
                                            : "bg-blue-200 text-blue-800 font-semibold"
                                        : darkMode
                                            ? "hover:bg-gray-800"
                                            : "hover:bg-gray-100"
                                }`}
                            >
                                Cochera
                            </button>

                            <button
                                onClick={() => setCurrent("puerta")}
                                className={`px-3 py-2 text-left rounded-lg transition cursor-pointer ${
                                    current === "puerta"
                                        ? darkMode
                                            ? "bg-gray-700 text-white font-semibold"
                                            : "bg-blue-200 text-blue-800 font-semibold"
                                        : darkMode
                                            ? "hover:bg-gray-800"
                                            : "hover:bg-gray-100"
                                }`}
                            >
                                Puertas
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setCurrent("perfil")}
                    className={`px-3 py-2 text-left rounded-lg transition cursor-pointer ${
                        current === "perfil"
                            ? darkMode
                                ? "bg-gray-700 text-white font-semibold"
                                : "bg-blue-100 text-blue-700 font-semibold"
                            : darkMode
                                ? "hover:bg-gray-800"
                                : "hover:bg-gray-100"
                    }`}
                >
                    Perfil
                </button>

                <button
                    onClick={() => setCurrent("chatbot")}
                    className={`px-3 py-2 text-left rounded-lg transition cursor-pointer ${
                        current === "chatbot"
                            ? darkMode
                                ? "bg-gray-700 text-white font-semibold"
                                : "bg-blue-100 text-blue-700 font-semibold"
                            : darkMode
                                ? "hover:bg-gray-800"
                                : "hover:bg-gray-100"
                    }`}
                >
                    Chatbot
                </button>
            </nav>

            <div className="border-t mt-10 pt-6" />

            {/* Botón de modo oscuro */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="mb-4 w-full px-3 py-2 rounded-lg transition cursor-pointer
                    bg-gray-200 hover:bg-gray-300 text-gray-800
                    dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
            >
                {darkMode ? "Modo Claro" : "Modo Oscuro"}
            </button>

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition cursor-pointer"
            >
                Cerrar sesión
            </button>
        </aside>
    );
}
