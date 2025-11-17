## ✦ Características

* **Dashboard minimalista:** Interfaz limpia en modo oscuro.
* **Indicadores de estado:** Puntos de color (Verde, Amarillo, Rojo) para una rápida visualización.
* **Datos en tiempo real:** Consume la API de Google Maps para obtener datos de tráfico precisos.
* **Actualización automática:** La información se refresca automáticamente cada 5 minutos.
* **Menú de perfil:** Enlace directo al portfolio del desarrollador.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Para la estructura semántica del contenido.
* **CSS3:** Para todos los estilos, diseño (Flexbox) y animaciones (menú), sin usar frameworks.
* **JavaScript (ES6+):** Para toda la lógica de la aplicación, incluyendo:
    * Manipulación del DOM (creación y actualización de la lista de carreteras).
    * Llamadas a la API y manejo de respuestas.
    * Lógica de negocio (convertir el retraso en segundos a un estado).
    * Temporizador (`setInterval`) para el refresco automático.
* **Google Maps Platform:**
    * **Maps JavaScript API:** Para cargar los servicios de Google.
    * **Distance Matrix API:** El motor principal, usado para calcular la diferencia entre `duration` (duración sin tráfico) y `duration_in_traffic` (duración con tráfico).

## ⚙️ ¿Cómo Funciona?

La lógica principal reside en `app.js`:

1.  Al cargar la página, la función `initializeUI` dibuja la lista de carreteras en estado "Cargando...".
2.  Inmediatamente, se llama a `fetchTrafficData`. Esta función itera sobre una lista de tramos predefinidos (objetos con coordenadas de origen y destino).
3.  Para cada tramo, se consulta el `DistanceMatrixService` de Google Maps.
4.  El script recibe la respuesta, extrae el tiempo de viaje normal y el tiempo con tráfico, y calcula el retraso (`delayInSeconds`).
5.  Basado en este retraso, se asigna un estado (`green`, `yellow`, `red`) y un texto (`Fluido`, `Congestionada`, `Atascada`).
6.  La función `updateDOM` actualiza la interfaz con los nuevos datos.
7.  Un `setInterval` vuelve a llamar a `fetchTrafficData` cada 5 minutos.
