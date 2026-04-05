const inicio = document.getElementById("pantalla-inicio");
const instrucciones = document.getElementById("pantalla-instrucciones");
const juego = document.getElementById("pantalla-juego");
const final = document.getElementById("pantalla-final");

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

const preguntas = [
    {
        pregunta: "L{ t }",
        correcta: "1/s^2",
        opciones: ["1/s", "1/s^2", "2/s^3"]
    },
    {
        pregunta: "L{ 1 }",
        correcta: "1/s",
        opciones: ["1/s", "1/s^2", "s"]
    },
    {
        pregunta: "L{ t^2 }",
        correcta: "2/s^3",
        opciones: ["1/s^2", "2/s^3", "6/s^4"]
    },
    {
        pregunta: "L{ e^t }",
        correcta: "1/(s-1)",
        opciones: ["1/(s+1)", "1/(s-1)", "s/(s^2+1)"]
    },
    {
        pregunta: "L{ sin(t) }",
        correcta: "1/(s^2+1)",
        opciones: ["1/(s^2+1)", "s/(s^2+1)", "1/s"]
    }
];

let actual;

function nuevaPregunta() {
    actual = preguntas[Math.floor(Math.random() * preguntas.length)];
    ecuacion.textContent = actual.pregunta;

    opcionesDiv.innerHTML = "";

    actual.opciones.forEach(op => {
        const btn = document.createElement("button");
        btn.textContent = op;

        btn.onclick = function() {

            // Desactivar todos
            const botones = opcionesDiv.querySelectorAll("button");
            botones.forEach(b => b.disabled = true);

            if (op === actual.correcta) {
                btn.classList.add("correcto");
                puntos++;
            } else {
                btn.classList.add("incorrecto");
                vidas--;

                // marcar correcta
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