const container = document.querySelector(".clima");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
    e.preventDefault();
    // validar campos
    const ciudad = document.querySelector("#ciudad").value;
    const pais = document.querySelector("#pais").value;
    if (ciudad === '' || pais === '') {
        mostrarError("Ambos campos son obligatorios.");
        return;
    }
    consultarApi(ciudad, pais);
}

function mostrarError(mensaje) {
    const alertaError = document.querySelector(".alerta-error");
    if (!alertaError) {
        const alerta = document.createElement("DIV");
        alerta.classList.add("alerta-error");
        alerta.innerHTML = `
            <strong class="alerta-error-bold">Error!</strong>
            <span>${mensaje}</span>
        `;
        container.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarApi(ciudad, pais) {
    const appId = 'be3c76a90872efc7cc2054c89f7ff220';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    console.log(url);

    // mostrar spinner de carga
    Spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            limpiarHTML();
            // validar si se ingresa una ciudad que no existe
            if (datos.cod === "404") {
                mostrarError("Ciudad no encontrada");
            }
            mostrarClima(datos);
        });
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos;
    const centrigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    // crear parrafos
    const nombreCiudad = document.createElement("p");
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add("titulo-ciudad");

    const actual = document.createElement("P");
    actual.innerHTML = `${centrigrados}&#8451;`;
    actual.classList.add("titulo-nombre");

    const temMaxima = document.createElement("P");
    temMaxima.innerHTML = `Máxima: ${max}&#8451;`;
    temMaxima.classList.add("parrafos")

    const temMinima = document.createElement("P");
    temMinima.innerHTML = `Mínima: ${min}&#8451;`;
    temMinima.classList.add("parrafos")

    // crear div
    const resultadoDiv = document.createElement("DIV");
    resultadoDiv.classList.add("div-contenedor");
    // agregar parrafo al div
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(temMaxima);
    resultadoDiv.appendChild(temMinima);
    // agregar al html
    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {
    limpiarHTML()

    const divSpinner = document.createElement("DIV");
    divSpinner.classList.add("loader");

    divSpinner.innerHTML = `
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
    `;

    resultado.appendChild(divSpinner);
}