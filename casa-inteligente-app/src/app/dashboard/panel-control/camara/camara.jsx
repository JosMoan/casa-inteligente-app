import React, { useState, useRef, useEffect } from "react";

const CameraPanel = () => {
  const BASE_URL = "http://192.168.1.120";
  const STREAM_URL = `${BASE_URL}:81/stream`;

  const [streamOn, setStreamOn] = useState(false);
  const [resolution, setResolution] = useState("10");
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [expandedPhoto, setExpandedPhoto] = useState(null); 
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const toggleStream = () => setStreamOn(!streamOn);

  const takePhoto = async () => {
    if (!streamOn) {
      alert("Primero inicia la cámara");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/capture`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCapturedPhoto(url);
    } catch (err) {
      console.error("Error al tomar la foto", err);
    }
  };

  const changeResolution = (value) => {
    fetch(`${BASE_URL}/control?var=framesize&val=${value}`);
    setResolution(value);
  };

  const removePhoto = () => {
    if (capturedPhoto) URL.revokeObjectURL(capturedPhoto);
    setCapturedPhoto(null);
  };

  // ZOOM CON WHEEL
  const handleWheel = (e) => {
    e.preventDefault();
    let newZoom = zoom - e.deltaY * 0.001;
    if (newZoom < 0.1) newZoom = 0.1;
    if (newZoom > 5) newZoom = 5;
    setZoom(newZoom);
  };

  // ARRASTRAR FOTO
  const handleMouseDown = (e) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => {
    dragging.current = false;
  };

  // RESET zoom y offset al cerrar modal
  const closeModal = () => {
    setExpandedPhoto(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // 🔹 PING AUTOMÁTICO cuando el stream está apagado
  useEffect(() => {
    let interval;
    if (!streamOn) {
      interval = setInterval(() => {
        fetch(`${BASE_URL}/capture`).catch(() => {});
      }, 30000); // cada 30 segundos
    }
    return () => clearInterval(interval);
  }, [streamOn]);

  return (
    <div style={styles.mainContainer}>
      {/* STREAM */}
      <div style={styles.cameraBox}>
        {streamOn ? (
          <div style={styles.streamWrapper}>
            <img src={STREAM_URL} alt="stream" style={styles.stream} />
          </div>
        ) : (
          <p style={styles.placeholderText}>Presiona "Iniciar Cámara"</p>
        )}
        <div style={styles.statusIndicator}>
          <span
            style={{
              ...styles.statusDot,
              backgroundColor: streamOn ? "green" : "red",
            }}
          />
          {streamOn ? "Cámara activa" : "Cámara inactiva"}
        </div>
      </div>

      {/* CONTROLES */}
      <div style={styles.controls}>
        <button style={styles.btn} onClick={toggleStream}>
          {streamOn ? "⏹ Detener Cámara" : "▶️ Iniciar Cámara"}
        </button>

        <button style={styles.btn} onClick={takePhoto}>
          📸 Tomar Foto
        </button>

        <div style={styles.resolutionContainer}>
          <label style={styles.label}>Resolución:</label>
          <select
            style={styles.select}
            value={resolution}
            onChange={(e) => changeResolution(e.target.value)}
          >
            <option value="10">UXGA</option>
            <option value="9">SXGA</option>
            <option value="8">XGA</option>
            <option value="7">SVGA</option>
            <option value="6">VGA</option>
            <option value="5">CIF</option>
            <option value="4">QVGA</option>
          </select>
        </div>

        {/* Mostrar foto capturada */}
        {capturedPhoto && (
          <div style={styles.capturedContainer}>
            <p>📷 Foto Capturada:</p>
            <div style={styles.photoWrapper}>
              <img
                src={capturedPhoto}
                alt="captured"
                style={styles.capturedPhoto}
                onClick={() => setExpandedPhoto(capturedPhoto)}
              />
              <button style={styles.removeBtn} onClick={removePhoto}>
                ✖
              </button>
            </div>
            <a
              href={capturedPhoto}
              download={`foto_esp32cam_${Date.now()}.jpg`}
              style={styles.downloadBtn}
            >
              💾 Descargar Foto
            </a>
          </div>
        )}
      </div>

      {/* MODAL FOTO EXPANDIDA */}
      {expandedPhoto && (
        <div
          style={styles.modalOverlay}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            src={expandedPhoto}
            alt="expandida"
            style={{
              ...styles.expandedPhoto,
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              cursor: dragging.current ? "grabbing" : "grab",
            }}
            draggable={false}
          />
          <button style={styles.closeModalBtn} onClick={closeModal}>
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  mainContainer: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    minHeight: "600px",
    background: "#0f172a",
    padding: "20px",
    borderRadius: "12px",
    color: "white",
    gap: "20px",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cameraBox: {
    flex: "3 1 800px",
    background: "#000",
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid #1e293b",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    minHeight: "500px",
    maxHeight: "90vh",
  },
  streamWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  stream: { width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" },
  placeholderText: { color: "#94a3b8", fontSize: "18px", textAlign: "center" },
  statusIndicator: { position: "absolute", bottom: "10px", left: "10px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" },
  statusDot: { width: "12px", height: "12px", borderRadius: "50%" },
  controls: { flex: "0 0 180px", display: "flex", flexDirection: "column", gap: "12px" },
  btn: { padding: "12px", background: "#1e293b", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px" },
  resolutionContainer: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "14px" },
  select: { padding: "10px", borderRadius: "8px", background: "#1e293b", color: "white", border: "none" },
  capturedContainer: { marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", position: "relative" },
  photoWrapper: { position: "relative", width: "100%" },
  capturedPhoto: { width: "100%", borderRadius: "8px", border: "2px solid #1e293b", cursor: "pointer" },
  removeBtn: { position: "absolute", top: "5px", left: "5px", background: "rgba(255,0,0,0.8)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" },
  downloadBtn: { padding: "8px", background: "#1e293b", color: "white", borderRadius: "8px", textDecoration: "none", textAlign: "center", cursor: "pointer" },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    cursor: "grab",
  },
  expandedPhoto: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "12px",
    boxShadow: "0 0 20px black",
    userSelect: "none",
  },
  closeModalBtn: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    zIndex: 10000,
  },
};

export default CameraPanel;
