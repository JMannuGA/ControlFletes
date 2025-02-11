let graficaMes;
let graficaAnio;  // Nueva variable para la gráfica anual

async function obtenerDatosGraficaMes(mes) {
    try {
        const url = mes ? `/api/Registros/GetGraficaDatosMes?mes=${mes}` : '/api/Registros/GetGraficaDatosMes';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error en la red');
        }

        const data = await response.json();
        const datosMes = data.datosMes || [];

        const ctxMes = document.getElementById('graficaMes').getContext('2d');

        if (graficaMes) {
            graficaMes.destroy();
        }

        graficaMes = new Chart(ctxMes, {
            type: 'bar',
            data: {
                labels: datosMes.map(d => `Dia ${d.Dia}`),
                datasets: [{
                    label: 'Numero de Coches (Mensual)',
                    data: datosMes.map(d => d.Total),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Dia'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Numero de Coches'
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener los datos de la gráfica mensual:', error);
    }
}

async function obtenerDatosGraficaAnio(anio) {
    try {
        const url = anio ? `/api/Registros/GetGraficaDatosAnio?anio=${anio}` : '/api/Registros/GetGraficaDatosAnio';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error en la red');
        }

        const data = await response.json();
        const datosAnio = data.datosAnio || [];

        const ctxAnio = document.getElementById('graficaAnio').getContext('2d');

        if (graficaAnio) {
            graficaAnio.destroy();
        }

        graficaAnio = new Chart(ctxAnio, {
            type: 'bar',
            data: {
                labels: datosAnio.map(d => `Mes ${d.Mes}`),
                datasets: [{
                    label: 'Numero de Coches (Anual)',
                    data: datosAnio.map(d => d.Total),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Mes'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Numero de Coches'
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener los datos de la gráfica anual:', error);
    }
}

async function inicializar() {
    const selectMes = document.getElementById('selectMes');
    const selectAnio = document.getElementById('selectAnio');

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Mes ${i}`;
        selectMes.appendChild(option);
    }

    const anioActual = new Date().getFullYear();
    for (let i = anioActual - 4; i <= anioActual; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}`;
        selectAnio.appendChild(option);
    }

    selectMes.addEventListener('change', async (event) => {
        const mesSeleccionado = event.target.value;
        await obtenerDatosGraficaMes(mesSeleccionado);
    });

    selectAnio.addEventListener('change', async (event) => {
        const anioSeleccionado = event.target.value;
        await obtenerDatosGraficaAnio(anioSeleccionado);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    inicializar();
});
