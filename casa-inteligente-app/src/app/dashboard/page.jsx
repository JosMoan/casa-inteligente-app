"use client";

import { useState, useEffect } from "react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import Sidebar from "../components/Sidebar/Sidebar";
import MainSection from "./main/page";
import LucesLeds from "./panel-control/luces/luces-leds";
import CameraPanel from "./panel-control/camara/camara";
import PuertasServo from "./panel-control/puertas/puertas-servo";
import PerfilSection from "./perfil/PerfilSection";
import ChatbotSection from "./chatbot/ChatbotSection";

export default function DashboardPage() {
  const router = useRouter();
  const [section, setSection] = useState("main");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("user");
    router.push("/login");
  };

  return (
    <div
      className={`flex h-screen transition-colors duration-300 
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* Sidebar */}
      <Sidebar
        current={section}
        setCurrent={setSection}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Contenido dinámico */}
      <div className="flex-1 overflow-y-auto p-0">
        {section === "main" && <MainSection />}
        {section === "panel" && <PanelSection />}
        {section === "luces" && <LucesLeds />}
        {section === "camara"&& <CameraPanel/>}
        {section === "puerta"&& <PuertasServo/>}
        {section === "perfil" && <PerfilSection />}
        {section === "chatbot" && <ChatbotSection />}
      </div>
    </div>
  );
}
