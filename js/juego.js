const inicio = document.getElementById("pantalla-inicio");
const instrucciones = document.getElementById("pantalla-instrucciones");
const juego = document.getElementById("pantalla-juego");
const final = document.getElementById("pantalla-final");

const ecuacion = document.getElementById("ecuacion");
const respuestaInput = document.getElementById("respuesta");

const puntosSpan = document.getElementById("puntos");
const tiempoSpan = document.getElementById("tiempo");
const vidasSpan = document.getElementById("vidas");
const puntuacionFinal = document.getElementById("puntuacion-final");

let puntos = 0;
let vidas = 3;
let tiempo = 60;
let intervalo;

const preguntas = [
    { pregunta: "L{ t }", respuesta: "1/s^2" },
    { pregunta: "L{ 1 }", respuesta: "1/s" },
    { pregunta: "L{ t^2 }", respuesta: "2/s^3" },
    { pregunta: "L{ t^3 }", respuesta: "6/s^4" },
    { pregunta: "L{ e^t }", respuesta: "1/(s-1)" },
    { pregunta: "L{ e^(2t) }", respuesta: "1/(s-2)" },
    { pregunta: "L{ sin(t) }", respuesta: "1/(s^2+1)" },
    { pregunta: "L{ cos(t) }", respuesta: "s/(s^2+1)" }
];

let actual;

function nuevaPregunta() {
    actual = preguntas[Math.floor(Math.random() * preguntas.length)];
    ecuacion.textContent = actual.pregunta;
    respuestaInput.value = "";
}

document.getElementById("btn-responder").onclick = function() {
    const respuesta = respuestaInput.value.trim().toLowerCase();

    if (respuesta === actual.respuesta) {
        puntos++;
    } else {
        vidas--;
    }

    puntosSpan.textContent = puntos;
    vidasSpan.textContent = vidas;

    if (vidas <= 0) {
        terminarJuego();
    } else {
        nuevaPregunta();
    }
};

function iniciarTiempo() {
    intervalo = setInterval(function() {
        tiempo--;
        tiempoSpan.textContent = tiempo;

        if (tiempo <= 0) {
            terminarJuego();
        }
    }, 1000);
}

function terminarJuego() {
    clearInterval(intervalo);
    juego.style.display = "none";
    final.style.display = "block";
    puntuacionFinal.textContent = puntos;
}

document.getElementById("btn-iniciar").onclick = function() {
    inicio.style.display = "none";
    juego.style.display = "block";
    nuevaPregunta();
    iniciarTiempo();
};

document.getElementById("btn-instrucciones").onclick = function() {
    inicio.style.display = "none";
    instrucciones.style.display = "block";
};

document.getElementById("btn-volver").onclick = function() {
    instrucciones.style.display = "none";
    inicio.style.display = "block";
};

document.getElementById("btn-reiniciar").onclick = function() {
    location.reload();
};