// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Definición de las Autopistas ---
    // Para CADA autopista, necesitamos un punto de origen y uno de destino
    // para que Google pueda calcular la ruta.
    // Puedes añadir todas las que quieras aquí.
    const highways = [
        {
            id: 'm30-sur',
            name: 'M-30 (Sur, Nudo Sur)',
            origin: { lat: 40.3900, lng: -3.6902 }, // Coordenadas de P. Sta. Mª de la Cabeza
            destination: { lat: 40.3950, lng: -3.6655 } // Coordenadas de Nudo Sur
        },
        {
            id: 'a2-entrada',
            name: 'A-2 (Entrada a Av. América)',
            origin: { lat: 40.4355, lng: -3.6490 }, // Zona Canillejas
            destination: { lat: 40.4320, lng: -3.6730 } // Av. de América
        },
        {
            id: 'a6-entrada',
            name: 'A-6 (Entrada a Moncloa)',
            origin: { lat: 40.4630, lng: -3.7530 }, // Zona Puerta de Hierro
            destination: { lat: 40.4360, lng: -3.7170 } // Zona Moncloa
        },
        {
            id: 'm40-norte',
            name: 'M-40 (Norte)',
            origin: { lat: 40.4850, lng: -3.6880 }, // Zona Sanchinarro
            destination: { lat: 40.4680, lng: -3.6100 } // Zona Feria de Madrid
        }
        // ... Añade aquí el resto de autopistas (A1, A3, A4, A5, M45, etc.)
    ];

    // Contenedor del HTML donde irá la lista
    const container = document.getElementById('traffic-list-container');

    // --- 2. Inicializar la Interfaz ---
    // Esta función crea los elementos HTML en la página (aún sin datos)
    function initializeUI() {
        // Limpiamos el contenedor por si acaso
        container.innerHTML = ''; 

        highways.forEach(road => {
            const item = document.createElement('div');
            item.className = 'highway-item';
            item.id = road.id; // Asignamos el ID único

            item.innerHTML = `
                <span class="status-dot grey"></span>
                <span class="name">${road.name}</span>
                <span class="condition">Cargando...</span>
            `;
            container.appendChild(item);
        });
    }

    // --- 3. La función CLAVE: Pedir datos a Google ---
    function fetchTrafficData() {
        console.log("Actualizando datos de tráfico...");
        const service = new google.maps.DistanceMatrixService();

        // Recorremos cada autopista que hemos definido
        highways.forEach(road => {
            
            service.getDistanceMatrix({
                origins: [road.origin],
                destinations: [road.destination],
                travelMode: 'DRIVING',
                drivingOptions: {
                    departureTime: new Date(Date.now()), // ¡Ahora mismo!
                    trafficModel: google.maps.TrafficModel.BEST_GUESS // Usar el tráfico actual
                }
            }, (response, status) => {
                // Esta función se ejecuta cuando Google responde
                if (status === 'OK') {
                    // Datos recibidos correctamente
                    const results = response.rows[0].elements[0];
                    const durationWithTraffic = results.duration_in_traffic.value; // seg
                    const durationWithoutTraffic = results.duration.value; // seg

                    // --- 4. Nuestra Lógica: Verde, Amarillo, Rojo ---
                    const delaySeconds = durationWithTraffic - durationWithoutTraffic;
                    let trafficStatus = 'green';
                    let conditionText = 'Fluido';

                    if (delaySeconds > 300) { // Más de 5 min de retraso
                        trafficStatus = 'red';
                        conditionText = 'Atascada';
                    } else if (delaySeconds > 120) { // Más de 2 min de retraso
                        trafficStatus = 'yellow';
                        conditionText = 'Congestionada';
                    }
                    
                    // Actualizamos la página
                    updateDOM(road.id, trafficStatus, conditionText);

                } else {
                    // Ha habido un error con la API
                    console.error('Error de Google API:', status);
                    updateDOM(road.id, 'grey', 'Error');
                }
            });
        });
    }

    // --- 5. Actualizar el HTML (el DOM) ---
    function updateDOM(id, statusClass, conditionText) {
        const element = document.getElementById(id);
        if (element) {
            const dot = element.querySelector('.status-dot');
            const condition = element.querySelector('.condition');

            // Quita las clases de color antiguas y pone la nueva
            dot.className = 'status-dot'; // Limpia
            dot.classList.add(statusClass); // Añade 'green', 'yellow' o 'red'

            condition.textContent = conditionText;
        }
    }

    // --- 6. El Refresco Automático ---
    // ¿Cada cuánto refrescar? Google actualiza el tráfico constantemente.
    // Para no gastar tu cuota de API muy rápido, 5 minutos (300,000 ms) es razonable.
    
    initializeUI();      // 1. Dibuja la lista inicial
    fetchTrafficData();  // 2. Pide los datos la primera vez
    
    // 3. Pide los datos de nuevo cada 5 minutos
    setInterval(fetchTrafficData, 300000); 

});