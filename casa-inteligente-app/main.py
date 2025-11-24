from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
import requests

app = FastAPI()

# --- Conexión a la base de datos ---
def get_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="casa_system"
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print("Error al conectar a MySQL:", e)
    return None

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- IP del ESP8266 ---
ESP_IP = "http://192.168.1.20"

# --- Mapas de LEDs y puertas ---
led_map = {
    "cochera": "COCHERA",
    "cocina": "COCINA",
    "dor1": "DOR1",
    "dor2": "DOR2",
    "sala": "SALA",
    "bano": "BANO"
}

# 🔥🔥🔥 AQUÍ SE AGREGA BIEN LA PUERTA PRINCIPAL (p5)
door_map = {
    "p1": "DOOR_BANO",
    "p2": "DOOR_DOR1",
    "p3": "DOOR_DOR2",
    "p5": "DOOR_PRIN"   # ✔ nombre corregido
}

garage_map = {
    "open": "COCHERA_ON",
    "close": "COCHERA_OFF"
}

# -------------------- Rutas básicas --------------------
@app.get("/")
def read_root():
    return {"message": "API FastAPI funcionando ✅"}

# -------------------- Usuarios --------------------
@app.post("/register")
def register_user(user: dict):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error al conectar a la BD")
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO usuarios (nombre, email, password) VALUES (%s, %s, %s)",
            (user["nombre"], user["email"], user["password"])
        )
        conn.commit()
        return {"mensaje": "✅ Usuario registrado"}
    except Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Error: {e}")
    finally:
        conn.close()

@app.post("/login")
def login_user(user: dict):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error BD")
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, nombre, email FROM usuarios WHERE email=%s AND password=%s",
        (user.get("email"), user.get("password"))
    )
    usuario = cursor.fetchone()
    conn.close()
    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    return {"mensaje": "✅ Login exitoso", "usuario": usuario}

# -------------------- LEDs --------------------
@app.post("/led/{room}/{state}")
def control_led(room: str, state: str):
    if room.lower() not in led_map:
        raise HTTPException(status_code=400, detail="Habitación no válida")
    if state.lower() not in ["on", "off"]:
        raise HTTPException(status_code=400, detail="Estado inválido")

    try:
        url = f"{ESP_IP}/{led_map[room.lower()]}_{state.upper()}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return {"status": "ok", "room": room, "state": state}
        else:
            return {"status": "error", "message": "ESP8266 no respondió"}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": str(e)}

@app.get("/led/status")
def get_led_status():
    status = {}
    for room, esp_name in led_map.items():
        try:
            url = f"{ESP_IP}/{esp_name}_STATUS"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                text = response.text.strip().upper()
                status[room] = True if text == "ON" else False
            else:
                status[room] = None
        except requests.exceptions.RequestException:
            status[room] = None
    return status

# -------------------- Puertas --------------------
@app.post("/door/{door_id}/{action}")
def control_door(door_id: str, action: str):
    if door_id.lower() not in door_map:
        raise HTTPException(status_code=400, detail="Puerta no válida")
    if action.lower() not in ["open", "close"]:
        raise HTTPException(status_code=400, detail="Acción inválida")

    try:
        url = f"{ESP_IP}/{door_map[door_id.lower()]}?action={action.lower()}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return {"status": "ok", "door": door_id, "action": action}
        else:
            return {"status": "error", "message": "ESP8266 no respondió"}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": str(e)}

@app.get("/door/status")
def get_door_status():
    status = {}
    for door_id, esp_name in door_map.items():
        try:
            url = f"{ESP_IP}/{esp_name}_STATUS"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                text = response.text.strip().upper()
                status[door_id] = True if text == "OPEN" else False
            else:
                status[door_id] = None
        except requests.exceptions.RequestException:
            status[door_id] = None
    return status

# -------------------- Cochera / Garage --------------------
@app.get("/garage/status")
def garage_status():
    try:
        res = requests.get(f"{ESP_IP}/DISTANCIA", timeout=5)
        if res.ok:
            distancia, estado = res.text.strip().split(",")
            return {
                "door_open": True if estado.upper() == "OPEN" else False,
                "distance_cm": int(distancia)
            }
    except requests.exceptions.RequestException:
        pass
    return {"door_open": None, "distance_cm": None}

@app.post("/garage/{action}")
def control_garage(action: str):
    if action.lower() not in garage_map:
        raise HTTPException(status_code=400, detail="Acción inválida")
    try:
        url = f"{ESP_IP}/{garage_map[action.lower()]}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return {"status": "ok", "door": "cochera", "action": action}
        else:
            return {"status": "error", "message": "ESP8266 no respondió"}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": str(e)}
