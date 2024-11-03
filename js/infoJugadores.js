class ModalJugador {
    mostrarDetallesJugador(jugador) {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => modal.remove();

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-container');

        const titulo = document.createElement('h2');
        titulo.textContent = jugador.player_name || 'No disponible';
        infoContainer.appendChild(titulo);

        const imagenPredeterminada = "https://apiv3.apifootball.com/badges/players/97489_t-messing.jpg";
        const imagen = document.createElement('img');
        imagen.src = jugador.player_image || imagenPredeterminada;
        imagen.alt = "Foto del jugador";
        infoContainer.appendChild(imagen);

        const graficos = document.createElement("canvas");
        graficos.classList.add("grafico");
        modalContent.appendChild(graficos);
        
        const labels = ['Estadisticas'];
        
        const data = {
          labels: labels,
          datasets: [
            {
              label: "Goles",
              data: [jugador.player_goals],
              backgroundColor: 'rgba(9, 129, 176, 0.2)',
              borderColor: 'rgba(9, 129, 176, 1)',
              borderWidth: 1
            },
            {
              label: "Tiros",
              data: [jugador.player_shots_total],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: "Faltas",
              data: [jugador.player_fouls_committed],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            {
              label: "Abordajes",
              data: [jugador.player_tackles],
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            },
            {
              label: "Intercepciones",
              data: [jugador.player_interceptions],
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            },
            {
              label: "Duelos",
              data: [jugador.player_duels_total],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)', 
              borderWidth: 1
            },
            {
              label: "Duelos Ganados",
              data: [jugador.player_duels_won],
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1
            },
            {
              label: "Regates",
              data: [jugador.player_dribble_attempts],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: "Regates realizados",
              data: [jugador.player_dribble_succ],
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        };
        
        const config = {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            scales: {
              r: {
                beginAtZero: true
              }
            }
          }
        };
        
        new Chart(graficos.getContext('2d'), config);

        const detalles = document.createElement('div');
        detalles.classList.add('detalles');

        const detallesHTML = `
            <p><strong>Número:</strong> ${jugador.player_number || 'No disponible'}</p>
            <p><strong>Edad:</strong> ${jugador.player_age || 'No disponible'}</p>
            <p><strong>Fecha de nacimiento:</strong> ${jugador.player_birthdate || 'No disponible'}</p>
            <p><strong>Equipo:</strong> ${jugador.team_name || 'No disponible'}</p>
            <p><strong>Goles:</strong> ${jugador.player_goals || '0'}</p>
            <p><strong>Tiros:</strong> ${jugador.player_shots_total || '0'}</p>
            <p><strong>Faltas:</strong> ${jugador.player_fouls_committed || '0'}</p>
            <p><strong>Abordajes:</strong> ${jugador.player_tackles || '0'}</p>
            <p><strong>Intercepciones:</strong> ${jugador.player_interceptions || '0'}</p>
            <p><strong>Duelos:</strong> ${jugador.player_duels_total || '0'}</p>
            <p><strong>Duelos ganados:</strong> ${jugador.player_duels_won || '0'}</p>
            <p><strong>Regates:</strong> ${jugador.player_dribble_attempts || '0'}</p>
            <p><strong>Regates realizados:</strong> ${jugador.player_dribble_succ || '0'}</p>
        `;
        detalles.innerHTML = detallesHTML;
        infoContainer.appendChild(detalles);

        modalContent.appendChild(infoContainer);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
}

export default ModalJugador;