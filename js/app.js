const destinations = [
    {
        id: "cartagena",
        name: "Cartagena de Indias",
        country: "Colombia",
        category: "Playa",
        rating: "4.9",
        days: "3–5 días",
        price: "Desde $450.000",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85",
        description: "Calles coloridas, murallas históricas y atardeceres inolvidables frente al Caribe."
    },
    {
        id: "medellin",
        name: "Medellín",
        country: "Colombia",
        category: "Ciudad",
        rating: "4.8",
        days: "2–4 días",
        price: "Desde $320.000",
        image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1000&q=85",
        description: "Una ciudad vibrante rodeada de montañas, cultura, gastronomía y arte urbano."
    },
    {
        id: "santamarta",
        name: "Santa Marta",
        country: "Colombia",
        category: "Naturaleza",
        rating: "4.8",
        days: "3–6 días",
        price: "Desde $380.000",
        image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=85",
        description: "Playas de aguas azules, naturaleza tropical y acceso al Parque Tayrona."
    },
    {
        id: "eje-cafetero",
        name: "Eje Cafetero",
        country: "Colombia",
        category: "Naturaleza",
        rating: "4.7",
        days: "3–5 días",
        price: "Desde $400.000",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85",
        description: "Paisajes verdes, fincas cafeteras y pueblos llenos de tradición."
    },
    {
        id: "san-andres",
        name: "San Andrés",
        country: "Colombia",
        category: "Playa",
        rating: "4.9",
        days: "4–6 días",
        price: "Desde $650.000",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=85",
        description: "Mar de siete colores, arrecifes y días perfectos para explorar el Caribe."
    },
    {
        id: "bogota",
        name: "Bogotá",
        country: "Colombia",
        category: "Ciudad",
        rating: "4.6",
        days: "2–4 días",
        price: "Desde $300.000",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85",
        description: "Museos, gastronomía, barrios culturales y una escena urbana diversa."
    }
];

// Busca el primer elemento HTML que coincida con el selector indicado.
const $ = (selector, root = document) => root.querySelector(selector);

// Busca todos los elementos HTML que coincidan y devuelve una lista normal.
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Lee los favoritos guardados en el navegador. Si no hay ninguno, devuelve una lista vacía.
const getFavorites = () => {
    return JSON.parse(localStorage.getItem("planify-favorites") || "[]");
};

// Guarda la lista actual de favoritos en el almacenamiento del navegador.
const setFavorites = (ids) => {
    localStorage.setItem("planify-favorites", JSON.stringify(ids));
};

// Muestra un pequeño mensaje temporal en la parte inferior de la página.
function toast(message) {
    let element = $("#toast");

    // Si el mensaje todavía no existe en el HTML, lo creamos.
    if (!element) {
        element = document.createElement("div");
        element.id = "toast";
        element.className = "toast";
        document.body.appendChild(element);
    }

    element.textContent = message;
    element.classList.add("show");

    // Cancela el temporizador anterior para reiniciar el tiempo del mensaje.
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        element.classList.remove("show");
    }, 2400);
}

// Construye el HTML de una tarjeta para un destino turístico.
function card(destination) {
    const saved = getFavorites().includes(destination.id);

    return `
        <article class="destination-card" data-destination="${destination.id}">
            <div class="destination-image">
                <img
                    src="${destination.image}"
                    alt="Paisaje de ${destination.name}"
                    loading="lazy"
                >
                <span class="tag">${destination.category}</span>
                <button
                    class="favorite-btn ${saved ? "saved" : ""}"
                    data-favorite="${destination.id}"
                    aria-label="Guardar ${destination.name}"
                    title="Guardar en favoritos"
                >${saved ? "♥" : "♡"}</button>
            </div>

            <div class="card-content">
                <div class="card-title-row">
                    <div>
                        <h3>${destination.name}</h3>
                        <div class="location">⌖ ${destination.country}</div>
                    </div>
                    <span class="rating">★ ${destination.rating}</span>
                </div>

                <p>${destination.description}</p>

                <div class="card-meta">
                    <span>◷ ${destination.days}</span>
                    <strong>${destination.price}</strong>
                </div>

                <div style="margin-top: 16px">
                    <a
                        class="btn btn-outline"
                        href="destino.html?id=${destination.id}"
                        style="width: 100%"
                    >Ver destino <span>→</span></a>
                </div>
            </div>
        </article>
    `;
}

// Dibuja las tarjetas dentro del contenedor indicado.
function renderCards(container, items) {
    if (container) {
        container.innerHTML = items.map(card).join("");
    }
}

// Configura el menú de navegación y resalta el enlace de la página actual.
function initHeader() {
    const toggle = $(".menu-toggle");
    const links = $(".nav-links");

    if (toggle && links) {
        toggle.addEventListener("click", () => {
            const open = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });
    }

    const current = location.pathname.split("/").pop() || "index.html";

    $$(".nav-links a").forEach((link) => {
        if (link.getAttribute("href") === current) {
            link.classList.add("active");
        }
    });
}

// Activa los botones para guardar o quitar destinos de favoritos.
function initFavorites() {
    // Actualiza el aspecto de los botones según los favoritos guardados.
    document.querySelectorAll("[data-favorite]").forEach((button) => {
        const saved = getFavorites().includes(button.dataset.favorite);
        button.classList.toggle("saved", saved);
        button.textContent = saved ? "♥" : "♡";
    });

    // Usamos un solo evento para atender los botones actuales y los que se creen después.
    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-favorite]");

        if (!button) {
            return;
        }

        const id = button.dataset.favorite;
        let ids = getFavorites();

        if (ids.includes(id)) {
            ids = ids.filter((favoriteId) => favoriteId !== id);
            toast("Destino eliminado de favoritos");
        } else {
            ids.push(id);
            toast("Destino guardado en favoritos ♥");
        }

        setFavorites(ids);

        // Actualiza todos los botones que correspondan al mismo destino.
        $$(`[data-favorite="${id}"]`).forEach((favoriteButton) => {
            const isSaved = ids.includes(id);
            favoriteButton.classList.toggle("saved", isSaved);

            if (favoriteButton.closest("#destination-detail")) {
                favoriteButton.textContent = isSaved
                    ? "♥ Guardado en favoritos"
                    : "♡ Guardar en favoritos";
            } else {
                favoriteButton.textContent = isSaved ? "♥" : "♡";
            }
        });

        // Si estamos en la página de favoritos, volvemos a dibujar la lista.
        const favoritesGrid = $("#favorite-grid");

        if (favoritesGrid) {
            const items = destinations.filter((destination) =>
                getFavorites().includes(destination.id)
            );

            renderCards(favoritesGrid, items);

            const emptyMessage = $("#favorites-empty");
            if (emptyMessage) {
                emptyMessage.hidden = items.length > 0;
            }
        }
    });
}

// Muestra los destinos y permite filtrarlos por texto y categoría.
function initExplore() {
    const grid = $("#destination-grid");

    // Si esta página no tiene la cuadrícula, no hay nada que configurar.
    if (!grid) {
        return;
    }

    renderCards(grid, destinations);

    const search = $("#destination-search");
    const category = $("#destination-category");

    function filterDestinations() {
        const query = (search?.value || "").toLowerCase().trim();
        const selectedCategory = category?.value || "Todos";

        const items = destinations.filter((destination) => {
            const matchesText =
                destination.name.toLowerCase().includes(query) ||
                destination.description.toLowerCase().includes(query);
            const matchesCategory =
                selectedCategory === "Todos" ||
                destination.category === selectedCategory;

            return matchesText && matchesCategory;
        });

        renderCards(grid, items);

        const emptyMessage = $("#explore-empty");
        if (emptyMessage) {
            emptyMessage.hidden = items.length > 0;
        }
    }

    search?.addEventListener("input", filterDestinations);
    category?.addEventListener("change", filterDestinations);
}

// Carga los destinos que el usuario guardó como favoritos en su página correspondiente.
function initFavoritesPage() {
    const grid = $("#favorite-grid");

    if (!grid) {
        return;
    }

    const items = destinations.filter((destination) =>
        getFavorites().includes(destination.id)
    );

    renderCards(grid, items);

    const emptyMessage = $("#favorites-empty");
    if (emptyMessage) {
        emptyMessage.hidden = items.length > 0;
    }
}

// Muestra la información completa del destino indicado en la URL.
function initDetail() {
    const target = $("#destination-detail");

    if (!target) {
        return;
    }

    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "cartagena";
    const destination = destinations.find((item) => item.id === id) || destinations[0];

    document.title = `${destination.name} | Planify`;

    const saved = getFavorites().includes(destination.id);

    target.innerHTML = `
        <div class="detail-grid">
            <div>
                <img
                    class="detail-cover"
                    src="${destination.image}"
                    alt="Paisaje de ${destination.name}"
                >

                <div class="detail-panel" style="margin-top: 20px">
                    <span class="eyebrow">${destination.category} · Colombia</span>
                    <h2>Descubre ${destination.name}</h2>
                    <p>
                        ${destination.description}
                        Planifica tu visita con tiempo para conocer sus lugares más representativos
                        y disfrutar a tu ritmo.
                    </p>

                    <h3>Ideas para tu viaje</h3>
                    <ul>
                        <li>Explora los lugares más conocidos de la zona.</li>
                        <li>Prueba la gastronomía local.</li>
                        <li>Reserva un momento para disfrutar el paisaje y tomar fotografías.</li>
                    </ul>

                    <button class="btn btn-primary ${saved ? "saved" : ""}" data-favorite="${destination.id}">
                        ${saved ? "♥ Guardado en favoritos" : "♡ Guardar en favoritos"}
                    </button>
                    <a class="btn btn-outline" href="crear-itinerario.html">Planificar viaje</a>
                </div>
            </div>

            <aside>
                <div class="info-panel">
                    <h3>✦ Resumen del destino</h3>
                    <p>⌖ ${destination.country}</p>
                    <p>★ ${destination.rating} · Valoración de referencia</p>
                    <p>◷ Duración sugerida: ${destination.days}</p>
                    <p>↗ Presupuesto estimado: ${destination.price}</p>
                </div>

                <div class="info-panel">
                    <h3>☀️ Antes de viajar</h3>
                    <p>
                        Consulta el clima y revisa el transporte, alojamiento y actividades
                        que deseas realizar.
                    </p>
                    <a class="btn btn-outline" href="clima.html" style="width: 100%">
                        Consultar clima
                    </a>
                </div>
            </aside>
        </div>
    `;
}

// Envía el texto de búsqueda rápida a la página Explorar.
function initSearchForm() {
    const form = $("#quick-search");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const query = $("#quick-destination")?.value || "";
            location.href = "explorar.html?q=" + encodeURIComponent(query);
        });
    }
}

// Muestra datos demostrativos del clima; no consulta un servicio meteorológico real.
function initWeather() {
    const form = $("#weather-form");

    if (!form) {
        return;
    }

    const city = $("#weather-city");
    const result = $("#weather-result");

    const weather = {
        cartagena: ["Cartagena", "29°", "Parcialmente soleado", "🌤️", "24°", "31°"],
        medellin: ["Medellín", "23°", "Nublado parcialmente", "⛅", "18°", "27°"],
        bogota: ["Bogotá", "16°", "Nublado", "☁️", "10°", "19°"],
        "santa marta": ["Santa Marta", "30°", "Soleado", "☀️", "25°", "33°"]
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const key = city.value.toLowerCase().trim();
        const aliases = {
            "cartagena de indias": "cartagena",
            "medellín": "medellin",
            "santa marta": "santa marta",
            santamarta: "santa marta",
            "bogotá": "bogota"
        };

        const normalized = aliases[key] || key;
        const data = weather[normalized];

        if (!data) {
            result.innerHTML = `
                <div class="empty-state">
                    <div class="emoji">🌦️</div>
                    <h2>Destino no disponible</h2>
                    <p>Por ahora puedes consultar Cartagena, Medellín, Bogotá o Santa Marta.</p>
                </div>
            `;
            return;
        }

        result.innerHTML = `
            <div class="weather-current">
                <div>
                    <span>Clima de referencia · ${data[0]}</span>
                    <div class="temp">${data[1]}</div>
                    <p>${data[2]}</p>
                </div>
                <div class="weather-emoji">${data[3]}</div>
            </div>

            <div class="forecast-grid">
                ${["Hoy", "Mañana", "Miércoles", "Jueves", "Viernes"].map((day, index) => `
                    <div class="forecast-day">
                        <small>${day}</small>
                        <div class="icon">${index % 2 ? data[3] : "☀️"}</div>
                        <strong>${parseInt(data[1]) + ((index % 3) - 1)}°</strong>
                        <small>${Math.max(12, parseInt(data[1]) - 5)}° mín.</small>
                    </div>
                `).join("")}
            </div>

            <div class="notice">
                Estos datos son demostrativos y no provienen de una API meteorológica en tiempo real.
            </div>
        `;
    });
}

// Valida y guarda los datos del formulario para crear un itinerario.
function initItineraryForm() {
    const form = $("#itinerary-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = {
            id: Date.now(),
            name: $("#trip-name").value.trim(),
            destination: $("#trip-destination").value,
            from: $("#trip-start").value,
            to: $("#trip-end").value,
            notes: $("#trip-notes").value.trim()
        };

        if (data.to < data.from) {
            toast("La fecha de regreso debe ser posterior a la salida");
            return;
        }

        const trips = JSON.parse(localStorage.getItem("planify-trips") || "[]");
        trips.push(data);
        localStorage.setItem("planify-trips", JSON.stringify(trips));

        toast("¡Itinerario guardado!");
        form.reset();

        setTimeout(() => {
            location.href = "itinerario.html";
        }, 650);
    });
}

// Lee y muestra los itinerarios guardados, y permite eliminar cualquiera de ellos.
function initTrips() {
    const list = $("#itinerary-list");

    if (!list) {
        return;
    }

    // Dibuja la lista con los datos actuales del almacenamiento local.
    function render() {
        const trips = JSON.parse(localStorage.getItem("planify-trips") || "[]");
        const emptyMessage = $("#trips-empty");

        if (emptyMessage) {
            emptyMessage.hidden = trips.length > 0;
        }

        list.innerHTML = trips.map((trip) => `
            <article class="itinerary-card">
                <div class="itinerary-date">
                    ✈<br>
                    <small>${trip.from || "Por definir"}</small>
                </div>

                <div style="flex: 1">
                    <h3>${trip.name}</h3>
                    <p>⌖ ${trip.destination} · ${trip.from || "Sin fecha"} → ${trip.to || "Sin fecha"}</p>
                    ${trip.notes ? `<p style="margin-top: 6px">${trip.notes}</p>` : ""}
                </div>

                <div class="itinerary-actions">
                    <button class="btn btn-outline small-btn" data-delete-trip="${trip.id}">
                        Eliminar
                    </button>
                </div>
            </article>
        `).join("");
    }

    render();

    // Detecta los clics en los botones Eliminar de los itinerarios.
    list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-delete-trip]");

        if (!button) {
            return;
        }

        const trips = JSON.parse(localStorage.getItem("planify-trips") || "[]");
        const remainingTrips = trips.filter(
            (trip) => String(trip.id) !== button.dataset.deleteTrip
        );

        localStorage.setItem("planify-trips", JSON.stringify(remainingTrips));
        render();
        toast("Itinerario eliminado");
    });
}

// Cuando el HTML termina de cargar, inicializamos las funciones de la página.
document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initFavorites();
    initExplore();
    initFavoritesPage();
    initDetail();
    initSearchForm();
    initWeather();
    initItineraryForm();
    initTrips();

    // Si la URL trae una búsqueda, la colocamos en el campo de Explorar y aplicamos el filtro.
    const query = new URLSearchParams(location.search).get("q");
    const search = $("#destination-search");

    if (query && search) {
        search.value = query;
        search.dispatchEvent(new Event("input"));
    }
});
