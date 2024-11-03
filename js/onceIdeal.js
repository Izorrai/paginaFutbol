import ModalJugador from "./infoJugadores.js";

const CLAVE_API = "e9aa4ab99d4a7c62574ab66068fc12b118e5fe1ac1a425832c01591dd9b42879";
const URL_BASE = "https://apiv3.apifootball.com/";
const modal = new ModalJugador();

const jugadoresSeleccionados = {
    portero: null,
    defensas: [],
    mediocampistas: [],
    delanteros: []
};

function guardarEquipoIdeal() {
    const equipoIdeal = {
        portero: jugadoresSeleccionados.portero,
        defensas: jugadoresSeleccionados.defensas,
        mediocampistas: jugadoresSeleccionados.mediocampistas,
        delanteros: jugadoresSeleccionados.delanteros
    };

    localStorage.setItem('equipoIdeal', JSON.stringify(equipoIdeal));
}

function cargarEquipoIdeal() {
    const equipoGuardado = localStorage.getItem('equipoIdeal');
    return equipoGuardado ? JSON.parse(equipoGuardado) : null;
}

function borrarEquipoIdeal() {
    localStorage.removeItem('equipoIdeal');
    location.reload();
}

function crearBotonBorrar() {
    const botonBorrar = document.createElement('button');
    botonBorrar.textContent = 'Borrar Equipo Guardado';
    botonBorrar.classList.add('boton-borrar-equipo');
    botonBorrar.onclick = borrarEquipoIdeal;
    return botonBorrar;
}

function mostrarEquipoGuardado(contenedor) {
    const equipoGuardado = cargarEquipoIdeal();
    if (!equipoGuardado) {
        contenedor.innerHTML = "<p>No hay equipo guardado</p>";
        return;
    }

    const equipoHTML = document.createElement('div');
    equipoHTML.classList.add('equipo-guardado');

    const titulo = document.createElement('h2');
    titulo.textContent = 'Once Ideal Guardado';
    equipoHTML.appendChild(titulo);

    if (equipoGuardado.portero) {
        equipoHTML.innerHTML += crearSeccionJugadores('Portero', [equipoGuardado.portero]);
    }

    if (equipoGuardado.defensas.length > 0) {
        equipoHTML.innerHTML += crearSeccionJugadores('Defensas', equipoGuardado.defensas);
    }

    if (equipoGuardado.mediocampistas.length > 0) {
        equipoHTML.innerHTML += crearSeccionJugadores('Mediocampistas', equipoGuardado.mediocampistas);
    }

    if (equipoGuardado.delanteros.length > 0) {
        equipoHTML.innerHTML += crearSeccionJugadores('Delanteros', equipoGuardado.delanteros);
    }

    equipoHTML.appendChild(crearBotonBorrar());

    contenedor.innerHTML = '';
    contenedor.appendChild(equipoHTML);
}

function crearSeccionJugadores(titulo, jugadores) {
    if (!jugadores || jugadores.length === 0) return '';

    return `
        <div class="seccion-equipo">
            <h3>${titulo}</h3>
            <div class="fila-jugadores">
                ${jugadores.map(jugador => `
                    <div class="tarjeta-jugador">
                        <img src="${jugador.player_image || 'https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg'}" 
                             alt="${jugador.player_name}"
                             onerror="this.src='https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg'">
                        <h4>${jugador.player_name}</h4>
                        <p>${jugador.team_name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

async function buscarJugador(nombreJugador) {
    try {
        const url = `${URL_BASE}?action=get_players&player_name=${encodeURIComponent(nombreJugador)}&APIkey=${CLAVE_API}`;
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error("Error al buscar jugador:", error);
        throw error;
    }
}

function crearTarjetaJugador(jugador, onAceptar, idInput) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    const infoJugador = {
        imagen: jugador.player_image || "https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg",
        nombre: jugador.player_name || 'No disponible',
        equipo: jugador.team_name || 'No disponible',
        goles: jugador.player_goals || '0'
    };

    tarjeta.innerHTML = `
        <img src="${infoJugador.imagen}" onerror="this.src='https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg'">
        <h4>Nombre: ${infoJugador.nombre}</h4>
        <p>Equipo: ${infoJugador.equipo}</p>
        <p>Goles: ${infoJugador.goles}</p>
        <button class="boton-aceptar">Aceptar</button>
    `;

    const botonAceptar = tarjeta.querySelector('.boton-aceptar');
    botonAceptar.addEventListener('click', () => {
        if (!jugadorYaSeleccionado(jugador)) {
            onAceptar(jugador);
            const input = document.getElementById(idInput);
            input.value = "";
            input.placeholder = jugador.player_name;
            input.disabled = true;
        } else {
            alert("Este jugador ya ha sido seleccionado.");
        }
    });

    tarjeta.addEventListener('click', (e) => {
        if (!e.target.classList.contains('boton-aceptar')) {
            modal.mostrarDetallesJugador(jugador);
        }
    });

    return tarjeta;
}

function jugadorYaSeleccionado(jugador) {
    return jugadoresSeleccionados.defensas.some(p => p.player_name === jugador.player_name) ||
           jugadoresSeleccionados.mediocampistas.some(p => p.player_name === jugador.player_name) ||
           jugadoresSeleccionados.delanteros.some(p => p.player_name === jugador.player_name) ||
           (jugadoresSeleccionados.portero && jugadoresSeleccionados.portero.player_name === jugador.player_name);
}

async function mostrarResultados(jugadores, contenedorID, tipoJugador, onAceptar, idInput) {
    
    const elementoInput = document.getElementById(idInput);
    
    let contenedorResultados = elementoInput.nextElementSibling;
    if (!contenedorResultados || !contenedorResultados.classList.contains('contenedor-resultados')) {
        contenedorResultados = document.createElement('div');
        contenedorResultados.classList.add('contenedor-resultados');
        elementoInput.parentNode.insertBefore(contenedorResultados, elementoInput.nextSibling);
    }
    
    contenedorResultados.innerHTML = "";

    if (!jugadores || jugadores.length === 0) {
        contenedorResultados.innerText = "No se encontraron resultados.";
        return;
    }

    const jugadoresFiltrados = jugadores.filter(jugador => jugador.player_type === tipoJugador);
    
    if (jugadoresFiltrados.length === 0) {
        contenedorResultados.innerText = `No se encontraron jugadores de tipo ${tipoJugador}.`;
        return;
    }

    jugadoresFiltrados.forEach(jugador => {
        const tarjeta = crearTarjetaJugador(jugador, onAceptar, idInput);
        contenedorResultados.appendChild(tarjeta);
    });
}

function borrarResultadosBusqueda() {
    const contenedoresResultados = document.querySelectorAll('.contenedor-resultados');
    contenedoresResultados.forEach(contenedor => {
        contenedor.innerHTML = "";
    });
}

function crearInputBusqueda(placeholder, onBuscar, idInput) {
    const contenedorInput = document.createElement("div");
    contenedorInput.classList.add("contenedor-input-busqueda");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.classList.add("buscador");
    input.id = idInput;

    contenedorInput.appendChild(input);

    let timeoutId = null;

    const manejarBusqueda = async (valor) => {
        if (valor.length >= 3) {
            try {
                const jugadores = await buscarJugador(valor);
                await onBuscar(jugadores, idInput);
            } catch (error) {
                const contenedorResultados = input.nextElementSibling;
                if (contenedorResultados) {
                    contenedorResultados.innerText = "Error al buscar el jugador";
                }
            }
        }
    };

    input.addEventListener("input", (e) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => manejarBusqueda(e.target.value.trim()), 500);
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const valor = input.value.trim();
            if (valor) {
                if (timeoutId) clearTimeout(timeoutId);
                manejarBusqueda(valor);
            }
        }
    });

    return contenedorInput;
}

function crearBusquedaPortero() {
    const contenedor = document.getElementById("once-ideal");
    
    const titulo = document.createElement("p");
    titulo.innerText = "Elige un portero para tu once ideal";
    contenedor.appendChild(titulo);

    const idBusquedaPortero = "busqueda-portero";
    
    const busquedaPortero = crearInputBusqueda(
        "Buscar portero por nombre",
        async (jugadores, idInput) => {
            await mostrarResultados(
                jugadores, 
                "resultados-once-ideal", 
                "Goalkeepers",
                (jugador) => {
                    jugadoresSeleccionados.portero = jugador;
                    borrarResultadosBusqueda();
                    guardarEquipoIdeal();
                    crearBusquedasDefensores();
                },
                idInput
            );
        },
        idBusquedaPortero
    );
    
    contenedor.appendChild(busquedaPortero);

    const contenedorResultados = document.createElement("div");
    contenedorResultados.id = "resultados-once-ideal";
    contenedor.appendChild(contenedorResultados);
}

function crearBusquedasDefensores() {
    const contenedor = document.getElementById("once-ideal");
    const maxDefensores = 4;
    
    const titulo = document.createElement("p");
    titulo.innerText = "Elige 4 defensas para tu once ideal";
    contenedor.appendChild(titulo);
    
    const contenedorDefensores = document.createElement("div");
    contenedorDefensores.classList.add("contenedor-defensores");
    contenedor.appendChild(contenedorDefensores);
    
    for (let i = 0; i < maxDefensores; i++) {
        const idBusquedaDefensor = `busqueda-defensor-${i}`;
        const busquedaDefensor = crearInputBusqueda(
            `Buscar defensa ${i + 1}`,
            async (jugadores, idInput) => {
                await mostrarResultados(
                    jugadores, 
                    "resultados-once-ideal", 
                    "Defenders",
                    (jugador) => {
                        if (jugadoresSeleccionados.defensas.length < maxDefensores) {
                            jugadoresSeleccionados.defensas.push(jugador);
                            borrarResultadosBusqueda();
                            guardarEquipoIdeal();
                            
                            if (jugadoresSeleccionados.defensas.length === maxDefensores) {
                                crearBusquedasMediocampistas();
                            }
                        } else {
                            alert("Ya has seleccionado 4 defensas.");
                        }
                    },
                    idInput
                );
            },
            idBusquedaDefensor
        );

        contenedorDefensores.appendChild(busquedaDefensor);
    }

    if (!document.getElementById("resultados-once-ideal")) {
        const contenedorResultados = document.createElement("div");
        contenedorResultados.id = "resultados-once-ideal";
        contenedor.appendChild(contenedorResultados);
    }
}

function crearBusquedasMediocampistas() {
    const contenedor = document.getElementById("once-ideal");
    const maxMediocampistas = 3;

    const titulo = document.createElement("p");
    titulo.innerText = "Elige 3 medios para tu once ideal";
    contenedor.appendChild(titulo);
    
    const contenedorMediocampistas = document.createElement("div");
    contenedorMediocampistas.classList.add("contenedor-mediocampistas");
    contenedor.appendChild(contenedorMediocampistas);
    
    for (let i = 0; i < maxMediocampistas; i++) {
        const idBusquedaMediocampista = `busqueda-mediocampista-${i}`;
        const busquedaMediocampista = crearInputBusqueda(
            `Buscar mediocampista ${i + 1}`,
            async (jugadores, idInput) => {
                await mostrarResultados(
                    jugadores, 
                    "resultados-once-ideal", 
                    "Midfielders",
                    (jugador) => {
                        if (jugadoresSeleccionados.mediocampistas.length < maxMediocampistas) {
                            jugadoresSeleccionados.mediocampistas.push(jugador);
                            borrarResultadosBusqueda();
                            guardarEquipoIdeal();
                            
                            if (jugadoresSeleccionados.mediocampistas.length === maxMediocampistas) {
                                crearBusquedasDelanteros();
                            }
                        } else {
                            alert("Ya has seleccionado 3 mediocampistas.");
                        }
                    },
                    idInput
                );
            },
            idBusquedaMediocampista
        );
        contenedorMediocampistas.appendChild(busquedaMediocampista);
    }

    if (!document.getElementById("resultados-once-ideal")) {
        const contenedorResultados = document.createElement("div");
        contenedorResultados.id = "resultados-once-ideal";
        contenedor.appendChild(contenedorResultados);
    }
}

function crearBusquedasDelanteros() {
    const contenedor = document.getElementById("once-ideal");
    const maxDelanteros = 3;

    const titulo = document.createElement("p");
    titulo.innerText = "Elige 3 delanteros para tu once ideal";
    contenedor.appendChild(titulo);
    
    const contenedorDelanteros = document.createElement("div");
    contenedorDelanteros.classList.add("contenedor-delanteros");
    contenedor.appendChild(contenedorDelanteros);
    
    for (let i = 0; i < maxDelanteros; i++) {
        const idBusquedaDelantero = `busqueda-delantero-${i}`;
        const busquedaDelantero = crearInputBusqueda(
            `Buscar delantero ${i + 1}`,
            async (jugadores, idInput) => {
                await mostrarResultados(
                    jugadores, 
                    "resultados-once-ideal", 
                    "Forwards",
                    (jugador) => {
                        if (jugadoresSeleccionados.delanteros.length < maxDelanteros) {
                            jugadoresSeleccionados.delanteros.push(jugador);
                            borrarResultadosBusqueda();
                            guardarEquipoIdeal();
                            
                            if (jugadoresSeleccionados.delanteros.length === maxDelanteros) {
                                mostrarEquipoCompleto();
                            }
                        } else {
                            alert("Ya has seleccionado 3 delanteros.");
                        }
                    },
                    idInput
                );
            },
            idBusquedaDelantero
        );
        contenedorDelanteros.appendChild(busquedaDelantero);
    }

    if (!document.getElementById("resultados-once-ideal")) {
        const contenedorResultados = document.createElement("div");
        contenedorResultados.id = "resultados-once-ideal";
        contenedor.appendChild(contenedorResultados);
    }
}

function mostrarEquipoCompleto() {
    const contenedor = document.getElementById("resultados-once-ideal");
    if (contenedor) {
        contenedor.innerHTML = "<h2>¡Tu once ideal está completo!</h2>";
        guardarEquipoIdeal();
        mostrarEquipoGuardado(contenedor);
    }
}

function iniciar() {
    const contenedor = document.getElementById("once-ideal");
    
    const contenedorEquipoGuardado = document.createElement('div');
    contenedorEquipoGuardado.id = 'contenedor-equipo-guardado';
    contenedor.insertBefore(contenedorEquipoGuardado, contenedor.firstChild);

    const equipoGuardado = cargarEquipoIdeal();
    if (equipoGuardado) {
        mostrarEquipoGuardado(contenedorEquipoGuardado);
        
        jugadoresSeleccionados.portero = equipoGuardado.portero;
        jugadoresSeleccionados.defensas = equipoGuardado.defensas;
        jugadoresSeleccionados.mediocampistas = equipoGuardado.mediocampistas;
        jugadoresSeleccionados.delanteros = equipoGuardado.delanteros;

        if (!equipoGuardado.portero) {
            crearBusquedaPortero();
        } else if (equipoGuardado.defensas.length < 4) {
            crearBusquedasDefensores();
        } else if (equipoGuardado.mediocampistas.length < 3) {
            crearBusquedasMediocampistas();
        } else if (equipoGuardado.delanteros.length < 3) {
            crearBusquedasDelanteros();
        }
    } else {
        crearBusquedaPortero();
    }

    if (!document.getElementById("resultados-once-ideal")) {
        const contenedorResultados = document.createElement("div");
        contenedorResultados.id = "resultados-once-ideal";
        contenedor.appendChild(contenedorResultados);
    }
}

iniciar()
