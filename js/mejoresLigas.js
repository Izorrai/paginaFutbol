


async function recibirPais(nombrePais) {
    const apiKey = "e9aa4ab99d4a7c62574ab66068fc12b118e5fe1ac1a425832c01591dd9b42879"; 
    const url = `https://apiv3.apifootball.com/?action=get_countries&APIkey=${apiKey}`;

    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP ERROR: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        return idpaises(datos, [nombrePais]);
    } catch (error) {
        console.error("Error al recibir países:", error);
        return [];
    }
}

function idpaises(datosPaises, paisesObjetivo) {
    const paisIds = [];

    datosPaises.forEach(pais => {
        if (paisesObjetivo.includes(pais.country_name)) {
            paisIds.push(pais.country_id);
        }
    });

    return paisIds;
}

async function recibirLiga(paisId) {
    const apiKey = "e9aa4ab99d4a7c62574ab66068fc12b118e5fe1ac1a425832c01591dd9b42879"; 
    const url = `https://apiv3.apifootball.com/?action=get_leagues&country_id=${paisId}&APIkey=${apiKey}`;
    
    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error("HTTP ERROR");
        }

        const datos = await respuesta.json();
        mostrarResultadoLigas(datos); 
    } catch (error) {
        console.log(error);
        const container = document.getElementById("resultados");
        container.innerText += `Error al buscar liga para el país con ID: ${paisId}.<br>`;
    }
}

function crearBotonesTopLigas() {
    const container = document.getElementById("buscarLigas");
    const mejoresLigas = document.createElement("div");
    mejoresLigas.classList.add("ligasTopBotones");

    const botones = [
        { text: "Alemania", value: "Germany" },
        { text: "Inglaterra", value: "England" },
        { text: "España", value: "Spain" },
        { text: "Italia", value: "Italy" },
    ];

    botones.forEach(boton => {
        const buttonElement = document.createElement("button");
        buttonElement.innerText = boton.text;
        buttonElement.value = boton.value;

        buttonElement.addEventListener("click", async () => {
            const container = document.getElementById("resultados");
            container.innerHTML = ''; 
            
            const ids = await recibirPais(boton.value);
            if (ids.length > 0) {
                await recibirLiga(ids[0]);
            } else {
                container.innerHTML = `No se encontró el país: ${boton.text}`;
            }
        });

        mejoresLigas.appendChild(buttonElement);
    });

    container.appendChild(mejoresLigas);
}

function mostrarResultadoLigas(datosLigas) {
    const container = document.getElementById("resultados");

    if (!datosLigas || datosLigas.length === 0) {  
        container.innerHTML += `No se encontraron ligas para este país.<br>`;
        return;
    }

    datosLigas.forEach(liga => {
        const datosLiga = document.createElement("div");
        datosLiga.classList.add("ligasTop");

        const image = document.createElement("img");
        const nombre = document.createElement("p");
        image.src = liga.league_logo || "https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg";
        nombre.innerText = liga.league_name || "No disponible";
        const id = liga.league_id;

        
        
        datosLiga.addEventListener("click", () => {
            
            container.innerHTML = ''; 
            console.log("ID de la liga:", id);
            
            recibirInfoLiga(id);
        });

        image.onerror = function() {
            console.error("Error al cargar la imagen, usando imagen de respaldo.");
            image.src = "https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg"; 
        };

        datosLiga.appendChild(image);
        datosLiga.appendChild(nombre);
        container.appendChild(datosLiga);
    });
}


async function recibirInfoLiga(ligaId){
    const apiKey = "e9aa4ab99d4a7c62574ab66068fc12b118e5fe1ac1a425832c01591dd9b42879"; 
    const url = `https://apiv3.apifootball.com/?action=get_teams&league_id=${ligaId}&APIkey=${apiKey}`;
    
    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error("HTTP ERROR");
        }

        const datos = await respuesta.json();
        mostrarDatosLigas(datos); 
    } catch (error) {
        console.log(error);
        const container = document.getElementById("resultados");
        container.innerText += `Error al obtener información para la liga con ID: ${ligaId}.<br>`;
    }
}



function mostrarDatosLigas(datosEquipos) {
    const container = document.getElementById("resultados");

    if (!datosEquipos || datosEquipos.length === 0) {  
        container.innerHTML += `No se encontraron equipos para esta liga.<br>`;
        return;
    }

    datosEquipos.forEach(equipo => {
        const equipoDiv = document.createElement("div");
        equipoDiv.classList.add("informacionEquipo");

        const image = document.createElement("img");
        const nombre = document.createElement("p");
        

        image.src = equipo.team_badge || "https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg";
        nombre.innerText = equipo.team_name || "No disponible";
        


        image.addEventListener("click", async () => {
            hideJugadores();
            showJugadores(); 
        });

        
        const contenedorJugadores = document.createElement("div");
        contenedorJugadores.classList.add("jugadores");

        
        if (equipo.players && equipo.players.length > 0) {
            equipo.players.forEach(jugador => {
                const jugadorDiv = document.createElement("p");
                const imagenJugador = document.createElement("img");
                const puesto = document.createElement("p")
                jugadorDiv.innerText = jugador.player_name || "No disponible";
                imagenJugador.src = jugador.player_image || "https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg";
                puesto.innerText = jugador.player_type || "No disponible";

                contenedorJugadores.appendChild(jugadorDiv);
                contenedorJugadores.appendChild(puesto);
                contenedorJugadores.appendChild(imagenJugador);
            });
        } else {
            const mensajeSinJugadores = document.createElement("p");
            mensajeSinJugadores.innerText = "No se encontraron jugadores.";
            contenedorJugadores.appendChild(mensajeSinJugadores);
        }

        equipoDiv.appendChild(image);
        equipoDiv.appendChild(nombre);
        equipoDiv.appendChild(contenedorJugadores);
        
        container.appendChild(equipoDiv);
    });
}
    


crearBotonesTopLigas();