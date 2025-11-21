// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {


const highways = [
        // --- M-30 (La Almendra) ---
        {
            id: 'm30-norte',
            name: 'M-30 Norte',
            details: 'Nudo Manoteras → Av. Ilustración',
            origin: { lat: 40.472, lng: -3.669 }, 
            destination: { lat: 40.479, lng: -3.715 } 
        },
        {
            id: 'm30-este-1',
            name: 'M-30 Este (Tramo A)',
            details: 'Costa Rica → O\'Donnell (Ventas)',
            origin: { lat: 40.456, lng: -3.662 }, 
            destination: { lat: 40.420, lng: -3.663 } 
        },
        {
            id: 'm30-este-2',
            name: 'M-30 Este (Tramo B)',
            details: 'O\'Donnell → A-3 (Conde de Casal)',
            origin: { lat: 40.420, lng: -3.663 }, 
            destination: { lat: 40.405, lng: -3.669 } 
        },
        {
            id: 'm30-sur',
            name: 'M-30 Sur',
            details: 'Méndez Álvaro → Nudo Sur',
            origin: { lat: 40.395, lng: -3.675 }, 
            destination: { lat: 40.390, lng: -3.690 } 
        },
        {
            id: 'm30-oeste',
            name: 'M-30 Oeste (Soterramiento)',
            details: 'San Vicente → P. Extremadura',
            origin: { lat: 40.420, lng: -3.720 }, 
            destination: { lat: 40.410, lng: -3.730 } 
        },

        // --- A-1 (Norte) ---
        {
            id: 'a1-ext',
            name: 'A-1 Exterior',
            details: 'Alcobendas → Sanchinarro (M-40)',
            origin: { lat: 40.540, lng: -3.635 }, 
            destination: { lat: 40.500, lng: -3.660 } 
        },
        {
            id: 'a1-int',
            name: 'A-1 Interior',
            details: 'Sanchinarro → Plaza Castilla',
            origin: { lat: 40.500, lng: -3.660 }, 
            destination: { lat: 40.465, lng: -3.689 } 
        },

        // --- A-2 (Este) ---
        {
            id: 'a2-ext',
            name: 'A-2 Exterior',
            details: 'Aeropuerto/M-40 → Canillejas',
            origin: { lat: 40.450, lng: -3.580 }, 
            destination: { lat: 40.445, lng: -3.610 } 
        },
        {
            id: 'a2-int',
            name: 'A-2 Interior',
            details: 'Canillejas → Av. América',
            origin: { lat: 40.445, lng: -3.610 }, 
            destination: { lat: 40.432, lng: -3.673 } 
        },

        // --- A-6 (Noroeste) ---
        {
            id: 'a6-ext',
            name: 'A-6 Exterior',
            details: 'Las Rozas → Hipódromo (M-40)',
            origin: { lat: 40.500, lng: -3.880 }, 
            destination: { lat: 40.465, lng: -3.760 } 
        },
        {
            id: 'a6-int',
            name: 'A-6 Interior',
            details: 'Hipódromo → Moncloa (Bus-VAO)',
            origin: { lat: 40.463, lng: -3.753 }, 
            destination: { lat: 40.436, lng: -3.717 } 
        },

        // --- A-42 (Sur - Toledo) ---
        {
            id: 'a42-ext',
            name: 'A-42 Exterior',
            details: 'Getafe → M-40 (Villaverde)',
            origin: { lat: 40.300, lng: -3.730 }, 
            destination: { lat: 40.350, lng: -3.710 } 
        },
        {
            id: 'a42-int',
            name: 'A-42 Interior',
            details: 'M-40 → Plaza Elíptica',
            origin: { lat: 40.350, lng: -3.710 }, 
            destination: { lat: 40.385, lng: -3.718 } 
        },

        // --- M-40 (Cinturón) ---
        {
            id: 'm40-norte',
            name: 'M-40 Norte',
            details: 'A-6 (Pardo) → A-1 (Sanchinarro)',
            origin: { lat: 40.490, lng: -3.750 }, 
            destination: { lat: 40.510, lng: -3.660 } 
        },
        {
            id: 'm40-este',
            name: 'M-40 Este',
            details: 'A-2 (Coslada) → A-3 (Vallecas)',
            origin: { lat: 40.440, lng: -3.590 }, 
            destination: { lat: 40.390, lng: -3.620 } 
        },
        {
            id: 'm40-sur',
            name: 'M-40 Sur',
            details: 'Mercamadrid → A-42 (Villaverde)',
            origin: { lat: 40.360, lng: -3.650 }, 
            destination: { lat: 40.350, lng: -3.710 } 
        }
    ];

    // Contenedor del HTML donde irá la lista
    const container = document.getElementById('traffic-list-container');

    // Esta función crea los elementos HTML en la página (aún sin datos)
    function initializeUI() {
        container.innerHTML = ''; 

        highways.forEach(road => {
            const item = document.createElement('div');
            item.className = 'highway-item';
            item.id = road.id; 
            
            item.setAttribute('data-name', road.name.toLowerCase());

            item.addEventListener('click', () => {
                // Creamos el enlace directo a la ruta
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${road.origin.lat},${road.origin.lng}&destination=${road.destination.lat},${road.destination.lng}&travelmode=driving`;
                window.open(mapsUrl, '_blank'); // Abre en pestaña nueva
            });

            item.innerHTML = `
                <span class="status-dot grey"></span>
                <div class="name-container">
                    <span class="name">${road.name}</span>
                    <span class="details">${road.details}</span>
                </div>
                <span class="condition">Cargando...</span>
`;
            container.appendChild(item);
        });
    }

    // --- 3. La función CLAVE: Pedir datos a Google ---
    function fetchTrafficData() {
        console.log("Actualizando datos de tráfico...");
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('last-updated').textContent = `Actualizado a las ${timeString}`;

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


    function updateDOM(id, statusClass, conditionText) {
        const element = document.getElementById(id);
        if (element) {
            const dot = element.querySelector('.status-dot');
            const condition = element.querySelector('.condition');

            
            dot.className = 'status-dot'; 
            dot.classList.add(statusClass); 

            condition.textContent = conditionText;
        }
    }

    
    initializeUI();      // 1. Dibuja la lista inicial
    fetchTrafficData();  // 2. Pide los datos la primera vez
    
    setInterval(fetchTrafficData, 300000); 

});

const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('keyup', (e) => {

        const term = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const items = document.querySelectorAll('.highway-item');

        items.forEach(item => {
            const rawName = item.getAttribute('data-name');
            const cleanName = rawName.replace(/[^a-z0-9]/g, '');

            if (cleanName.includes(term)) {
                item.style.display = 'flex'; // Mostrar
            } else {
                item.style.display = 'none'; // Ocultar
            }
        });
    });