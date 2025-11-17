// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Definición de las Autopistas ---
    // Para CADA autopista, necesitamos un punto de origen y uno de destino
    // para que Google pueda calcular la ruta.
const highways = [
    // --- CIRCUNVALACIONES (M-30, M-40, M-45, M-50) ---
    {
        id: 'm30-sur',
        name: 'M-30 (Sur, Nudo Sur)',
        origin: { lat: 40.3900, lng: -3.6902 }, // P. Sta. Mª de la Cabeza
        destination: { lat: 40.3950, lng: -3.6655 } // Nudo Sur
    },
    {
        id: 'm30-este',
        name: 'M-30 (Este, Av. América)',
        origin: { lat: 40.435, lng: -3.670 }, // Nudo Av. América
        destination: { lat: 40.419, lng: -3.665 } // Nudo O'Donnell
    },
    {
        id: 'm40-norte',
        name: 'M-40 (Norte, Sanchinarro)',
        origin: { lat: 40.4850, lng: -3.6880 }, // Sanchinarro
        destination: { lat: 40.4680, lng: -3.6100 } // Feria de Madrid
    },
    {
        id: 'm45-este',
        name: 'M-45 (Tramo Este)',
        origin: { lat: 40.390, lng: -3.600 }, // Conexión A-3
        destination: { lat: 40.440, lng: -3.565 } // Conexión A-2
    },
    {
        id: 'm50-oeste',
        name: 'M-50 (Tramo Oeste, Boadilla)',
        origin: { lat: 40.415, lng: -3.860 }, // Boadilla
        destination: { lat: 40.470, lng: -3.830 } // Conexión A-6
    },

    // --- RADIALES (A-1 a A-6) ---
    {
        id: 'a1-entrada',
        name: 'A-1 (Entrada a Pza. Castilla)',
        origin: { lat: 40.485, lng: -3.675 }, // Cerca de Sanchinarro
        destination: { lat: 40.465, lng: -3.689 } // Plaza Castilla
    },
    {
        id: 'a2-entrada',
        name: 'A-2 (Entrada a Av. América)',
        origin: { lat: 40.4355, lng: -3.6490 }, // Canillejas
        destination: { lat: 40.4320, lng: -3.6730 } // Av. de América
    },
    {
        id: 'a3-entrada',
        name: 'A-3 (Entrada a Conde de Casal)',
        origin: { lat: 40.395, lng: -3.615 }, // Vicálvaro
        destination: { lat: 40.407, lng: -3.669 } // Conde de Casal
    },
    {
        id: 'a4-entrada',
        name: 'A-4 (Entrada a C/ Méndez Álvaro)',
        origin: { lat: 40.315, lng: -3.695 }, // Getafe
        destination: { lat: 40.390, lng: -3.695 } // Nudo M-30
    },
    {
        id: 'a5-entrada',
        name: 'A-5 (Entrada a P. Extremadura)',
        origin: { lat: 40.370, lng: -3.785 }, // Cuatro Vientos
        destination: { lat: 40.410, lng: -3.730 } // P. de Extremadura
    },
    {
        id: 'a6-entrada',
        name: 'A-6 (Entrada a Moncloa)',
        origin: { lat: 40.4630, lng: -3.7530 }, // Puerta de Hierro
        destination: { lat: 40.4360, lng: -3.7170 } // Moncloa
    }
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