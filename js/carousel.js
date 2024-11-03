
let partidos = [];
let slideActual = 0;
let intervaloAutoplay;


const carousel = document.getElementById('carousel');


function obtenerPartidos() {
    carousel.innerHTML = '<div class="cargando">Cargando partidos...</div>';
    
    fetch("https://v3.football.api-sports.io/fixtures?live=all", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "340c65d3c3467ccde61bb1a63b45031f"
        }
    })
    .then(response => response.json())
    .then(data => {
        partidos = data.response;
        mostrarPartidos();
        iniciarAutoplay();
    })
    .catch(err => {
        console.error(err);
        carousel.innerHTML = '<div class="cargando">Error al cargar los partidos</div>';
    });
}


function mostrarPartidos() {
    if (partidos.length === 0) {
        carousel.innerHTML = '<div class="cargando">No hay partidos en vivo</div>';
        return;
    }

    let html = '';
    
   
    partidos.forEach((partido, index) => {
        html += `
            <div class="partido ${index === slideActual ? 'activo' : ''}">
                <div class="equipo">
                    <img src="${partido.teams.home.logo}" alt="${partido.teams.home.name}">
                    <p>${partido.teams.home.name}</p>
                </div>
                <div class="marcador">
                    <div class="goles">${partido.goals.home} - ${partido.goals.away}</div>
                    <div class="tiempo">${partido.fixture.status.elapsed}'</div>
                </div>
                <div class="equipo">
                    <img src="${partido.teams.away.logo}" alt="${partido.teams.away.name}">
                    <p>${partido.teams.away.name}</p>
                </div>
            </div>
        `;
    });

   
    html += `
        <div class="botones">
            <button class="boton" onclick="cambiarSlide(-1)">❮</button>
            <button class="boton" onclick="cambiarSlide(1)">❯</button>
        </div>
    `;

    
    html += '<div class="indicadores">';
    for (let i = 0; i < partidos.length; i++) {
        html += `
            <div class="indicador ${i === slideActual ? 'activo' : ''}" 
                 onclick="irASlide(${i})">
            </div>
        `;
    }
    html += '</div>';

    carousel.innerHTML = html;
}


function cambiarSlide(direccion) {
    slideActual = (slideActual + direccion + partidos.length) % partidos.length;
    mostrarPartidos();
    reiniciarAutoplay();
}


function irASlide(index) {
    slideActual = index;
    mostrarPartidos();
    reiniciarAutoplay();
}


function iniciarAutoplay() {
    clearInterval(intervaloAutoplay);
    intervaloAutoplay = setInterval(() => {
        cambiarSlide(1);
    }, 5000);
}


function reiniciarAutoplay() {
    clearInterval(intervaloAutoplay);
    iniciarAutoplay();
}


function actualizarDatos() {
    obtenerPartidos();
}


document.addEventListener('DOMContentLoaded', () => {
    obtenerPartidos();
    
    setInterval(actualizarDatos, 60000);
});