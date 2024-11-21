import cv2
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

def detect_face_and_search():
    # Configuración del detector de rostros
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    video_capture = cv2.VideoCapture(0)
    detected = False
    face_path = "captured_face.jpg"
    margin_ratio = 0.5  # Ajusta este valor para cambiar el tamaño del margen

    while not detected:
        ret, frame = video_capture.read()
        if not ret:
            print("Error al acceder a la cámara")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        for (x, y, w, h) in faces:
            # Calcula márgenes para ampliar el área del rostro
            margin_w = int(w * margin_ratio)
            margin_h = int(h * margin_ratio)

            # Ajusta las coordenadas para incluir el margen adicional
            x1 = max(0, x - margin_w // 2)
            y1 = max(0, y - margin_h // 2)
            x2 = min(frame.shape[1], x + w + margin_w // 2)
            y2 = min(frame.shape[0], y + h + margin_h // 2)

            # Dibuja el nuevo rectángulo alrededor del rostro ampliado
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

            # Recorta la imagen incluyendo el margen
            cropped_face = frame[y1:y2, x1:x2]
            cv2.imwrite(face_path, cropped_face)
            detected = True
            print("Rostro capturado para búsqueda...")

        cv2.imshow('Detección de rostro', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

    if detected:
        # Convierte la ruta a una absoluta antes de buscar
        absolute_face_path = os.path.abspath(face_path)
        # Realizar la búsqueda inversa
        search_google_with_image(absolute_face_path)

def search_google_with_image(image_path):
    # Configuración del navegador con Selenium
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.get("https://images.google.com/")

    try:
        # Botón de búsqueda por imagen
        upload_button = driver.find_element(By.CLASS_NAME, "Gdd5U")
        upload_button.click()

        # Subir imagen
        time.sleep(2)
        file_input = driver.find_element(By.NAME, "encoded_image")
        file_input.send_keys(image_path)
        
        print("Cargando la imagen para búsqueda inversa...")
        time.sleep(5)  # Esperar a que se carguen los resultados

        # Obtener resultados
        results = driver.find_elements(By.CSS_SELECTOR, "div.g a")
        if results:
            print("Resultados encontrados:")
            for result in results[:5]:  # Muestra los primeros 5 resultados
                print(result.get_attribute("href"))
        else:
            print("No se encontraron coincidencias.")

    except Exception as e:
        print("Error durante la búsqueda:", e)
    finally:
        driver.quit()

# Ejecutar la función principal
if __name__ == "__main__":
    detect_face_and_search()
