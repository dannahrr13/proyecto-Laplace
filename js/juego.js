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

let puntos = 0;
let vidas = 3;
let tiempo = 60;
let intervalo;
let preguntas = [];

const facil = [
    { pregunta: "L{ t }", correcta: "1/s^2", opciones: ["1/s", "1/s^2", "2/s^3"] },
    { pregunta: "L{ 1 }", correcta: "1/s", opciones: ["1/s", "s", "1/s^2"] }
];

const medio = [
    { pregunta: "L{ t^2 }", correcta: "2/s^3", opciones: ["2/s^3", "6/s^4", "1/s^2"] },
    { pregunta: "L{ sin(t) }", correcta: "1/(s^2+1)", opciones: ["1/(s^2+1)", "s/(s^2+1)", "1/s"] }
];

const dificil = [
    { pregunta: "L{ e^t }", correcta: "1/(s-1)", opciones: ["1/(s-1)", "1/(s+1)", "s/(s^2+1)"] },
    { pregunta: "L{ cos(t) }", correcta: "s/(s^2+1)", opciones: ["s/(s^2+1)", "1/(s^2+1)", "1/s"] }
];

let actual;

function mostrarPantalla(p) {
    Object.values(pantallas).forEach(x => x.classList.add("oculto"));
    p.classList.remove("oculto");
}

function nuevaPregunta() {
    actual = preguntas[Math.floor(Math.random() * preguntas.length)];

    ecuacion.classList.remove("cambio");
    void ecuacion.offsetWidth;
    ecuacion.classList.add("cambio");

    ecuacion.textContent = actual.pregunta;
    opcionesDiv.innerHTML = "";

    actual.opciones.forEach(op => {
        const btn = document.createElement("button");
        btn.textContent = op;

        btn.onclick = function() {
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
                if (vidas <= 0) {
                    terminarJuego();
                } else {
                    nuevaPregunta();
                }
            }, 800);
        };

        opcionesDiv.appendChild(btn);
    });
}

function iniciarTiempo() {
    intervalo = setInterval(() => {
        tiempo--;
        tiempoSpan.textContent = tiempo;

        if (tiempo <= 0) terminarJuego();
    }, 1000);
}

function terminarJuego() {
    clearInterval(intervalo);
    puntuacionFinal.textContent = puntos;
    mostrarPantalla(pantallas.final);
}

function iniciarJuego(nivel) {
    puntos = 0;
    vidas = 3;
    tiempo = 60;

    if (nivel === "facil") preguntas = facil;
    if (nivel === "medio") preguntas = medio;
    if (nivel === "dificil") preguntas = dificil;

    mostrarPantalla(pantallas.juego);
    nuevaPregunta();
    iniciarTiempo();
}

document.getElementById("btn-jugar").onclick = () => mostrarPantalla(pantallas.niveles);
document.getElementById("btn-instrucciones").onclick = () => mostrarPantalla(pantallas.instrucciones);
document.getElementById("btn-volver").onclick = () => mostrarPantalla(pantallas.inicio);

document.getElementById("btn-facil").onclick = () => iniciarJuego("facil");
document.getElementById("btn-medio").onclick = () => iniciarJuego("medio");
document.getElementById("btn-dificil").onclick = () => iniciarJuego("dificil");

document.getElementById("btn-reiniciar").onclick = () => location.reload();

// ===== MUSICA =====
const musica = document.getElementById("musica");
const sonidoCorrecto = document.getElementById("correcto-sound");
const sonidoError = document.getElementById("error-sound");

// reproducir musica al iniciar
document.getElementById("btn-jugar").addEventListener("click", () => {
    musica.play();
});

// ===== SONIDOS EN RESPUESTAS =====
const viejaNuevaPregunta = nuevaPregunta;

nuevaPregunta = function() {
    viejaNuevaPregunta();

    const botones = opcionesDiv.querySelectorAll("button");

    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.textContent === actual.correcta) {
                sonidoCorrecto.play();
            } else {
                sonidoError.play();
            }
        });
    });
};

// ===== BARRA DE TIEMPO =====
const barra = document.getElementById("barra-tiempo");

const viejoTiempo = iniciarTiempo;

iniciarTiempo = function() {
    viejoTiempo();

    const tiempoTotal = 60;

    setInterval(() => {
        let porcentaje = (tiempo / tiempoTotal) * 100;
        barra.style.width = porcentaje + "%";
    }, 200);
};

// ===== GUARDAR RECORD =====
function guardarRecord() {
    let record = localStorage.getItem("record") || 0;

    if (puntos > record) {
        localStorage.setItem("record", puntos);
    }
}

// mostrar record en final
const viejoFinal = terminarJuego;

terminarJuego = function() {
    guardarRecord();
    viejoFinal();

    let record = localStorage.getItem("record") || 0;

    const texto = document.createElement("p");
    texto.textContent = "Record: " + record;

    document.querySelector("#pantalla-final .card").appendChild(texto);
};

// ===== EFECTO CAMBIO PRO =====
const viejaFuncion = nuevaPregunta;

nuevaPregunta = function() {
    ecuacion.style.transform = "scale(0.8)";
    ecuacion.style.opacity = "0";

    setTimeout(() => {
        viejaFuncion();
        ecuacion.style.transform = "scale(1)";
        ecuacion.style.opacity = "1";
    }, 200);
};