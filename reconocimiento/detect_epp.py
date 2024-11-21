from flask import Flask, Response, jsonify
import torch
import cv2
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Cargar el modelo entrenado
model = torch.hub.load('ultralytics/yolov5', 'custom', path='modelo/best.pt')

def generate_frames():
    cap = cv2.VideoCapture(0)  # Usa la cámara predeterminada

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Realiza la detección de EPP en el frame
        results = model(frame)
        detected_classes = [x['name'] for x in results.pandas().xyxy[0].to_dict(orient="records")]

        # Contar las infracciones de cada tipo de EPP incorrecto
        infracciones_count = {
            "casco_incorrecto": detected_classes.count("casco incorrecto"),
            "chaleco_incorrecto": detected_classes.count("chaleco incorrecto"),
            "zapatos_incorrecto": detected_classes.count("zapatos incorrecto"),
            "guantes_incorrecto": detected_classes.count("guantes incorrecto"),
        }

        # Enviar solicitudes de registro solo para infracciones detectadas
        for epp, count in infracciones_count.items():
            if count > 0:  # Solo enviar si hubo al menos una infracción detectada
                for _ in range(count):  # Registrar cada infracción individualmente
                    try:
                        requests.post('http://localhost:5002/log_infraccion', json={"tipo": epp})
                        print(f"Infracción registrada: {epp}")
                    except requests.exceptions.RequestException as e:
                        print(f"Error al registrar infracción para {epp}: {e}")

        # Dibuja las detecciones en el frame
        results.render()
        ret, buffer = cv2.imencode('.jpg', results.ims[0])
        frame = buffer.tobytes()

        # Genera el frame para el navegador
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
