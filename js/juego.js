// PANTALLAS
const pantallas = {
    inicio: document.getElementById("pantalla-inicio"),
    instrucciones: document.getElementById("pantalla-instrucciones"),
    niveles: document.getElementById("pantalla-niveles"),
    juego: document.getElementById("pantalla-juego"),
    final: document.getElementById("pantalla-final")
};

// ELEMENTOS
const ecuacion = document.getElementById("ecuacion");
const opcionesDiv = document.getElementById("opciones");

const puntosSpan = document.getElementById("puntos");
const tiempoSpan = document.getElementById("tiempo");
const vidasSpan = document.getElementById("vidas");
const puntuacionFinal = document.getElementById("puntuacion-final");

// VARIABLES
let puntos = 0;
let vidas = 3;
let tiempo = 60;

let intervalo;
let intervaloAnimacion;

let preguntas = [];
let actual;
let bloqueado = false;

// NIVELES
const facil = [
    { pregunta: "L{ t }", correcta: "1/s^2", opciones: ["1/s", "1/s^2", "2/s^3"] },
    { pregunta: "L{ 1 }", correcta: "1/s", opciones: ["1/s", "s", "1/s^2"] },
    { pregunta: "L{ t^2 }", correcta: "2/s^3", opciones: ["2/s^3", "1/s^2", "6/s^4"] },
    { pregunta: "L{ 3 }", correcta: "3/s", opciones: ["3/s", "1/s", "3/s^2"] }
];

const medio = [
    { pregunta: "L{ t^2 }", correcta: "2/s^3", opciones: ["2/s^3", "6/s^4", "1/s^2"] },
    { pregunta: "L{ sin(t) }", correcta: "1/(s^2+1)", opciones: ["1/(s^2+1)", "s/(s^2+1)", "1/s"] },
    { pregunta: "L{ cos(t) }", correcta: "s/(s^2+1)", opciones: ["s/(s^2+1)", "1/(s^2+1)", "1/s"] },
    { pregunta: "L{ 2sin(t) }", correcta: "2/(s^2+1)", opciones: ["2/(s^2+1)", "1/(s^2+1)", "2s/(s^2+1)"] }
];

const dificil = [
    { pregunta: "L{ e^t }", correcta: "1/(s-1)", opciones: ["1/(s-1)", "1/(s+1)", "s/(s^2+1)"] },
    { pregunta: "L{ cos(t) }", correcta: "s/(s^2+1)", opciones: ["s/(s^2+1)", "1/(s^2+1)", "1/s"] },
    { pregunta: "L{ e^{-t} }", correcta: "1/(s+1)", opciones: ["1/(s+1)", "1/(s-1)", "s/(s^2+1)"] },
    { pregunta: "L{ e^{2t} }", correcta: "1/(s-2)", opciones: ["1/(s-2)", "1/(s+2)", "2/(s-2)"] }
];

// CAMBIAR PANTALLA
function mostrarPantalla(p) {
    Object.values(pantallas).forEach(x => x.classList.add("oculto"));
    p.classList.remove("oculto");
}

// MEZCLAR OPCIONES
function mezclar(array) {
    return array.sort(() => Math.random() - 0.5);
}
//record
const recordSpan = document.getElementById("record");
let record = parseInt(localStorage.getItem("record")) || 0;
recordSpan.textContent = record;


// NUEVA PREGUNTA
function nuevaPregunta() {

    ecuacion.style.opacity = "0";
    ecuacion.style.transform = "scale(0.8)";

    setTimeout(() => {

        actual = preguntas[Math.floor(Math.random() * preguntas.length)];

        ecuacion.textContent = actual.pregunta;
        opcionesDiv.innerHTML = "";

        const opcionesMezcladas = mezclar([...actual.opciones]);

        opcionesMezcladas.forEach(op => {
            const btn = document.createElement("button");
            btn.textContent = op;

            btn.onclick = () => {

                if (bloqueado) return;
                bloqueado = true;

                const botones = opcionesDiv.querySelectorAll("button");
                botones.forEach(b => b.disabled = true);

                if (op === actual.correcta) {
                    btn.classList.add("correcto");
                    puntos++;
                } else {
                    btn.classList.add("incorrecto");
                    vidas--;

                    botones.forEach(b => {
                        if (b.textContent === actual.correcta) {
                            b.classList.add("correcto");
                        }
                    });
                }

                puntosSpan.textContent = puntos;
                vidasSpan.textContent = vidas;

                setTimeout(() => {
                    bloqueado = false;

                    if (vidas <= 0) terminarJuego();
                    else nuevaPregunta();

                }, 800);
            };

            opcionesDiv.appendChild(btn);
        });

        ecuacion.style.opacity = "1";
        ecuacion.style.transform = "scale(1)";

    }, 200);
}

// TIEMPO
function iniciarTiempo() {

    clearInterval(intervalo);
    clearInterval(intervaloAnimacion);

    intervalo = setInterval(() => {
        tiempo--;
        tiempoSpan.textContent = tiempo;

        if (tiempo <= 0) terminarJuego();
    }, 1000);

    // animación del contador
    let ultimo = tiempo;

    intervaloAnimacion = setInterval(() => {
        if (tiempo !== ultimo) {
            tiempoSpan.style.transform = "scale(1.3)";
            setTimeout(() => {
                tiempoSpan.style.transform = "scale(1)";
            }, 150);
            ultimo = tiempo;
        }
    }, 100);
}

// TERMINAR
function terminarJuego() {
    clearInterval(intervalo);
    clearInterval(intervaloAnimacion);

    puntuacionFinal.textContent = puntos;

    // ACTUALIZAR RECORD
    if (puntos > record) {
        record = puntos;
        localStorage.setItem("record", record);
    }

    recordSpan.textContent = record;

    const card = document.querySelector("#pantalla-final .card");
    if (card) {
        card.style.animation = "pop 0.5s";
    }

    mostrarPantalla(pantallas.final);
}


// INICIAR
function iniciarJuego(nivel) {

    clearInterval(intervalo);
    clearInterval(intervaloAnimacion);

    puntos = 0;
    vidas = 3;
    tiempo = 60;

    puntosSpan.textContent = puntos;
    vidasSpan.textContent = vidas;
    tiempoSpan.textContent = tiempo;

    if (nivel === "facil") preguntas = facil;
    if (nivel === "medio") preguntas = medio;
    if (nivel === "dificil") preguntas = dificil;

    mostrarPantalla(pantallas.juego);
    nuevaPregunta();
    iniciarTiempo();
}

// EVENTOS
document.getElementById("btn-jugar").onclick = () => mostrarPantalla(pantallas.niveles);
document.getElementById("btn-instrucciones").onclick = () => mostrarPantalla(pantallas.instrucciones);
document.getElementById("btn-volver").onclick = () => mostrarPantalla(pantallas.inicio);

document.getElementById("btn-facil").onclick = () => iniciarJuego("facil");
document.getElementById("btn-medio").onclick = () => iniciarJuego("medio");
document.getElementById("btn-dificil").onclick = () => iniciarJuego("dificil");

document.getElementById("btn-reiniciar").onclick = () => location.reload();
