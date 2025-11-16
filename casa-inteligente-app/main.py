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

@app.get("/")
def read_root():
    return {"message": "API FastAPI funcionando ✅"}

@app.get("/db-test")
def db_test():
    conn = get_connection()
    if not conn:
        return {"status": "error", "message": "❌ No se pudo conectar"}
    cursor = conn.cursor()
    cursor.execute("SELECT DATABASE();")
    db_name = cursor.fetchone()
    conn.close()
    return {"status": "ok", "database": db_name}

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

# --- IP del ESP8266 ---
ESP_IP = "http://192.168.1.20"

# --- Control de luces ---
@app.post("/led/{room}/{state}")
def control_led(room: str, state: str):
    valid_rooms = ["cochera", "cocina", "dor1", "dor2", "sala", "bano"]  # ✅
    valid_states = ["on", "off"]

    if room.lower() not in valid_rooms:
        raise HTTPException(status_code=400, detail="Habitación no válida")
    if state.lower() not in valid_states:
        raise HTTPException(status_code=400, detail="Estado inválido")

    try:
        url = f"{ESP_IP}/{room.upper()}_{state.upper()}"
        response = requests.get(url, timeout=3)
        if response.status_code == 200:
            return {"status": "ok", "room": room, "state": state}
        else:
            return {"status": "error", "message": "ESP8266 no respondió"}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": str(e)}

# --- Obtener estado actual de los LEDs ---
@app.get("/led/status")
def get_led_status():
    rooms = ["cochera", "cocina", "dor1", "dor2", "sala","bano"]  # ✅
    status = {}
    for room in rooms:
        try:
            url = f"{ESP_IP}/{room.upper()}_STATUS"
            response = requests.get(url, timeout=3)
            if response.status_code == 200:
                text = response.text.strip().upper()
                status[room] = True if text == "ON" else False
            else:
                status[room] = None
        except requests.exceptions.RequestException:
            status[room] = None
    return status
