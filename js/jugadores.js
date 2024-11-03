
import ModalJugador from "./infoJugadores.js";
const modal = new ModalJugador();


async function recibirJugador(jugador) {
    const apiKey = "e9aa4ab99d4a7c62574ab66068fc12b118e5fe1ac1a425832c01591dd9b42879";
    const url = `https://apiv3.apifootball.com/?action=get_players&player_name=${jugador}&APIkey=${apiKey}`;
    

    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error("HTTP ERROR");
        }

        const datos = await respuesta.json();
        mostrarResultado(datos);
    } catch (error) {
        console.log(error);
        const container = document.getElementById("resultados");
        container.innerText = "Error al buscar el jugador";
    }
}

function mostrarResultado(datosJugadores) {
    const container = document.getElementById("resultados");
    const imagenPredeterminada = "./imagenes/cara-enojada.png"
    container.innerHTML = "";
    

    if (!datosJugadores || datosJugadores.length === 0) {  
        container.innerText = "No se encontraron resultados.";
        return;
    }

    datosJugadores.forEach(jugador => {

       /*  if (jugador.player_goals == 0 && ) {
            return; 
        } */


        const datosJugador = document.createElement("div");
        datosJugador.classList.add("carta");

        const image = document.createElement("img");
        const nombre = document.createElement("h4");
        const numero = document.createElement("p");
        const fechaNacimiento = document.createElement("p");
        const edad = document.createElement("p");
        const goles = document.createElement("p");
        const equipo = document.createElement("p");
        const tiros = document.createElement("p");
        const faltas = document.createElement("p");
        const abordajes = document.createElement("p");
        const intercepciones = document.createElement("p");
        const duelos = document.createElement("p");
        const duelos_ganados = document.createElement("p");
        const intentos_regate = document.createElement("p");
        const regates_realizados = document.createElement("p");
                
        nombre.innerText = `Nombre: ${jugador.player_name || 'No disponible'}`;
        image.src = jugador.player_image || "https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg";
        
        image.onerror = function() {
            image.src = "https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg";
        };
        
        equipo.innerText = `Equipo: ${jugador.team_name || 'No disponible'}`;
        goles.innerText = `Goles: ${jugador.player_goals || '0'}`;

        
        tiros.innerText = jugador.player_shots_total;
        faltas.innerText = jugador.player_fouls_committed
        abordajes.innerText = jugador.player_tackles
        intercepciones.innerText = jugador.player_interceptions
        duelos.innerHTML = jugador.player_duels_total
        duelos_ganados.innerText = jugador.player_duels_won
        intentos_regate.innerText = jugador.player_dribble_attempts
        regates_realizados.innerText = jugador.player_dribble_succ


        datosJugador.appendChild(image);
        datosJugador.appendChild(nombre);
        datosJugador.appendChild(numero);
        datosJugador.appendChild(fechaNacimiento);
        datosJugador.appendChild(edad);
        datosJugador.appendChild(goles);
        datosJugador.appendChild(equipo);
        
        




        
        container.appendChild(datosJugador);

        datosJugador.addEventListener('click', () => modal.mostrarDetallesJugador(jugador));
    

    });
}

function crearInputBusqueda() {
    const contenedor = document.getElementById("buscar-jugador"); 
    if (!contenedor) {
        console.error("No se encontró el contenedor de búsqueda");
        return null;
    }

    const buscador = document.createElement("input");
    buscador.placeholder = "Buscar jugadores por nombre";
    buscador.type = "text";
    buscador.classList.add("buscador");
    
    let timeoutId = null;
    buscador.addEventListener("input", async (e) => {
        const valorBusqueda = e.target.value.trim();
        
       
        if (timeoutId) clearTimeout(timeoutId);
        
        
        if (valorBusqueda.length >= 3) {
            timeoutId = setTimeout(() => {
                recibirJugador(valorBusqueda);
            }, 500);
        }
    });

    buscador.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            const valorBusqueda = buscador.value.trim();
            if (valorBusqueda) {
                if (timeoutId) clearTimeout(timeoutId);
                await recibirJugador(valorBusqueda);
            }
        }
    });

    contenedor.appendChild(buscador);
    return buscador; 
}

crearInputBusqueda();




