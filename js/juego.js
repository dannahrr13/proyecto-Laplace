const pantallas = {
    inicio: document.getElementById("pantalla-inicio"),
    instrucciones: document.getElementById("pantalla-instrucciones"),
    niveles: document.getElementById("pantalla-niveles"),
    juego: document.getElementById("pantalla-juego"),
    final: document.getElementById("pantalla-final")
};

const ecuacion = document.getElementById("ecuacion");
const opcionesDiv = document.getElementById("opciones");

const puntosSpan = document.getElementById("puntos");
const tiempoSpan = document.getElementById("tiempo");
const vidasSpan = document.getElementById("vidas");
const puntuacionFinal = document.getElementById("puntuacion-final");

const musica = document.getElementById("musica");
const sonidoCorrecto = document.getElementById("correcto-sound");
const sonidoError = document.getElementById("error-sound");
const barra = document.getElementById("barra-tiempo");

let puntos = 0;
let vidas = 3;
let tiempo = 60;
let intervalo;
let preguntas = [];

const facil = [
    { pregunta: "L{ t }", correcta: "1/s^2", opciones: ["1/s","1/s^2","2/s^3"] }
];

let actual;

function mostrarPantalla(p) {
    Object.values(pantallas).forEach(x => x.classList.add("oculto"));
    p.classList.remove("oculto");
}

function nuevaPregunta() {
    actual = preguntas[Math.floor(Math.random() * preguntas.length)];
    ecuacion.textContent = actual.pregunta;
    opcionesDiv.innerHTML = "";

    actual.opciones.forEach(op => {
        const btn = document.createElement("button");
        btn.textContent = op;

        btn.onclick = function() {
            if (op === actual.correcta) {
                sonidoCorrecto.play();
                puntos++;
                btn.classList.add("correcto");
            } else {
                sonidoError.play();
                vidas--;
                btn.classList.add("incorrecto");
            }

            puntosSpan.textContent = puntos;
            vidasSpan.textContent = vidas;

            setTimeout(nuevaPregunta, 800);
        };

        opcionesDiv.appendChild(btn);
    });
}

function iniciarTiempo() {
    intervalo = setInterval(() => {
        tiempo--;
        tiempoSpan.textContent = tiempo;
        barra.style.width = (tiempo / 60) * 100 + "%";

        if (tiempo <= 0) terminarJuego();
    }, 1000);
}

function terminarJuego() {
    clearInterval(intervalo);
    musica.pause();
    puntuacionFinal.textContent = puntos;
    mostrarPantalla(pantallas.final);
}

document.getElementById("btn-jugar").onclick = () => {
    musica.play();
    preguntas = facil;
    mostrarPantalla(pantallas.niveles);
};

document.getElementById("btn-volver").onclick = () => mostrarPantalla(pantallas.inicio);
document.getElementById("btn-reiniciar").onclick = () => location.reload();

document.getElementById("btn-facil").onclick = () => {
    mostrarPantalla(pantallas.juego);
    nuevaPregunta();
    iniciarTiempo();
};