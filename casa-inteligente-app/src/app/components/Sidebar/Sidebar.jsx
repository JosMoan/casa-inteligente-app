"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ current, setCurrent, darkMode, setDarkMode }) {
    const router = useRouter();

    // Sidebar abierto/cerrado
    const [collapsed, setCollapsed] = useState(false);

    // Subpanel
    const [openPanel, setOpenPanel] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <aside
            className={`
                h-screen p-6 shadow-md border-r flex flex-col transition-all duration-300
                ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-200"}
                ${collapsed ? "w-20" : "w-64"}
            `}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-10">
                {/* Título */}
                {!collapsed && <h2 className="text-2xl font-bold">Casa Inteligente</h2>}

                {/* Botón colapsar */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    <i className={`bi ${collapsed ? "bi-arrow-right-square" : "bi-arrow-left-square"} text-xl`} />
                </button>
            </div>

            {/* NAV PRINCIPAL */}
            <nav className="flex flex-col gap-3">

                {/* Inicio */}
                <button
                    onClick={() => setCurrent("main")}
                    className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-3
                        ${current === "main"
                            ? darkMode
                                ? "bg-gray-700 text-white font-semibold"
                                : "bg-blue-100 text-blue-700 font-semibold"
                            : darkMode
                                ? "hover:bg-gray-800"
                                : "hover:bg-gray-100"
                        }`}
                >
                    <i className="bi bi-house text-xl"></i>
                    {!collapsed && "Inicio"}
                </button>

                {/* PANEL DE CONTROL */}
                <div>
                    <button
                        onClick={() => collapsed || setOpenPanel(!openPanel)}
                        className={`px-3 py-2 rounded-lg w-full transition cursor-pointer flex items-center gap-3
                            ${["panel", "luces", "camara", "puerta"].includes(current)
                                ? darkMode
                                    ? "bg-gray-700 text-white font-semibold"
                                    : "bg-blue-100 text-blue-700 font-semibold"
                                : darkMode
                                    ? "hover:bg-gray-800"
                                    : "hover:bg-gray-100"
                            }`}
                    >
                        <i className="bi bi-card-list text-xl"></i>
                        {!collapsed && "Panel de control"}
                    </button>

                    {/* Submenú solo si sidebar no está colapsado */}
                    {!collapsed && openPanel && (
                        <div className="flex flex-col ml-4 mt-2 gap-2">

                            {/* Luces */}
                            <button
                                onClick={() => setCurrent("luces")}
                                className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-3
                                    ${current === "luces"
                                        ? darkMode
                                            ? "bg-gray-700 text-white font-semibold"
                                            : "bg-blue-200 text-blue-800 font-semibold"
                                        : darkMode
                                            ? "hover:bg-gray-800"
                                            : "hover:bg-gray-100"
                                    }`}
                            >
                                <i className="bi bi-lightbulb-fill text-xl"></i>
                                {!collapsed && "Luces LED"}
                            </button>

                            {/* Cámara */}
                            <button
                                onClick={() => setCurrent("camara")}
                                className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-3
                                    ${current === "camara"
                                        ? darkMode
                                            ? "bg-gray-700 text-white font-semibold"
                                            : "bg-blue-200 text-blue-800 font-semibold"
                                        : darkMode
                                            ? "hover:bg-gray-800"
                                            : "hover:bg-gray-100"
                                    }`}
                            >
                                <i className="bi bi-webcam-fill text-xl"></i>
                                {!collapsed && "Cámara"}
                            </button>

                            {/* Puertas */}
                            <button
                                onClick={() => setCurrent("puerta")}
                                className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-3
                                    ${current === "puerta"
                                        ? darkMode
                                            ? "bg-gray-700 text-white font-semibold"
                                            : "bg-blue-200 text-blue-800 font-semibold"
                                        : darkMode
                                            ? "hover:bg-gray-800"
                                            : "hover:bg-gray-100"
                                    }`}
                            >
                                <i className="bi bi-door-closed-fill text-xl"></i>
                                {!collapsed && "Puertas"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Perfil */}
                <button
                    onClick={() => setCurrent("perfil")}
                    className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-3
                        ${current === "perfil"
                            ? darkMode
                                ? "bg-gray-700 text-white font-semibold"
                                : "bg-blue-100 text-blue-700 font-semibold"
                            : darkMode
                                ? "hover:bg-gray-800"
                                : "hover:bg-gray-100"
                        }`}
                >
                    <i className="bi bi-person-lines-fill text-xl"></i>
                    {!collapsed && "Perfil"}
                </button>

                {/* Chatbot */}
                <button
                    onClick={() => setCurrent("chatbot")}
                    className={`px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-3
                        ${current === "chatbot"
                            ? darkMode
                                ? "bg-gray-700 text-white font-semibold"
                                : "bg-blue-100 text-blue-700 font-semibold"
                            : darkMode
                                ? "hover:bg-gray-800"
                                : "hover:bg-gray-100"
                        }`}
                >
                    <i className="bi bi-robot text-xl"></i>
                    {!collapsed && "Chatbot"}
                </button>

            </nav>

            {/* Línea divisora */}
            <div className="border-t mt-10 pt-6" />

            {/* BOTÓN MODO OSCURO */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="mb-4 w-full px-3 py-2 rounded-lg transition cursor-pointer
                    flex items-center justify-center gap-2
                    bg-gray-200 hover:bg-gray-300 text-gray-800
                    dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
            >
                <i className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-fill"} text-xl`} />
                {!collapsed && (darkMode ? "Modo Claro" : "Modo Oscuro")}
            </button>

            {/* LOGOUT */}
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg
                    transition cursor-pointer flex items-center justify-center gap-3"
            >
                <i className="bi bi-box-arrow-in-left text-xl"></i>
                {!collapsed && "Cerrar sesión"}
            </button>
        </aside>
    );
}
