const pantallas = {
    inicio: document.getElementById("pantalla-inicio"),
    instrucciones: document.getElementById("pantalla-instrucciones"),
    niveles: document.getElementById("pantalla-niveles"),
    juego: document.getElementById("pantalla-juego"),
    final: document.getElementById("pantalla-final")
};

const sonidoCorrecto = document.getElementById("sonido-correcto");
const sonidoError = document.getElementById("sonido-error");
const sonidoWin = document.getElementById("sonido-win");

const ecuacion = document.getElementById("ecuacion");
const opcionesDiv = document.getElementById("opciones");

const puntosSpan = document.getElementById("puntos");
const tiempoSpan = document.getElementById("tiempo");
const vidasSpan = document.getElementById("vidas");
const puntuacionFinal = document.getElementById("puntuacion-final");

let nombreJugador = "";
let puntos = 0;
let vidas = 3;
let tiempo = 60;
let intervalo;
let preguntas = [];
let actual;
let tiempoMax = 60;

const facil = [
    { pregunta: "L{ t }", correcta: "1/s^2", opciones: ["1/s", "1/s^2", "2/s^3"] },
    { pregunta: "L{ 1 }", correcta: "1/s", opciones: ["1/s", "s", "1/s^2"] },
    { pregunta: "L{ t^2 }", correcta: "2/s^3", opciones: ["2/s^3", "1/s^2", "6/s^4"] },
    { pregunta: "L{ 3 }", correcta: "3/s", opciones: ["3/s", "1/s", "3/s^2"] }
];

const medio = [
    { pregunta: "L{ t^2 }", correcta: "2/s^3", opciones: ["2/s^3", "6/s^4", "1/s^2"] },
    { pregunta: "L{ sin(t) }", correcta: "1/(s^2+1)", opciones: ["1/(s^2+1)", "s/(s^2+1)", "1/s"] },
    { pregunta: "L{ 2sin(t) }", correcta: "2/(s^2+1)", opciones: ["2/(s^2+1)", "1/(s^2+1)", "2s/(s^2+1)"] }
];

const dificil = [
    { pregunta: "L{ e^t }", correcta: "1/(s-1)", opciones: ["1/(s-1)", "1/(s+1)", "s/(s^2+1)"] },
    { pregunta: "L{ cos(t) }", correcta: "s/(s^2+1)", opciones: ["s/(s^2+1)", "1/(s^2+1)", "1/s"] },
    { pregunta: "L{ e^{2t} }", correcta: "1/(s-2)", opciones: ["1/(s-2)", "1/(s+2)", "2/(s-2)"] }
    ];

function mostrarPantalla(p) {
    Object.values(pantallas).forEach(x => x.classList.add("oculto"));
    setTimeout(() => p.classList.remove("oculto"), 50);
}

function nuevaPregunta() {
    actual = preguntas[Math.floor(Math.random()*preguntas.length)];
    ecuacion.textContent = actual.pregunta;
    opcionesDiv.innerHTML = "";

    actual.opciones.forEach(op => {
        const btn = document.createElement("button");
        btn.textContent = op;

        btn.onclick = () => {

            if (op === actual.correcta) {
    puntos++;
    btn.classList.add("correcto");
    sonidoCorrecto.currentTime = 0;
    sonidoCorrecto.play();
} else {
    vidas--;
    btn.classList.add("incorrecto");
    sonidoError.currentTime = 0;
    sonidoError.play();
}
           puntosSpan.textContent = puntos;
            vidasSpan.textContent = vidas;

            setTimeout(() => {
                if (vidas <= 0) terminarJuego();
                else nuevaPregunta();
            }, 600);
        };

        opcionesDiv.appendChild(btn);
    });
}

function iniciarTiempo() {
    const barra = document.getElementById("barra-tiempo");

    intervalo = setInterval(() => {
        tiempo--;
        tiempoSpan.textContent = tiempo;
        barra.style.width = (tiempo/tiempoMax*100)+"%";

        if (tiempo <= 0) terminarJuego();
    },1000);
}

function guardarRanking() {
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.push({nombre: nombreJugador, puntos: puntos});
    ranking.sort((a,b)=>b.puntos-a.puntos);
    ranking = ranking.slice(0,5);

    localStorage.setItem("ranking", JSON.stringify(ranking));

    const lista = document.getElementById("ranking");
    lista.innerHTML = "";

    ranking.forEach(j => {
        const li = document.createElement("li");
        li.textContent = j.nombre + " - " + j.puntos + " " + calcularEstrellas(j.puntos);
        lista.appendChild(li);
    });
}

function terminarJuego() {
    clearInterval(intervalo);

    puntuacionFinal.textContent = puntos;

    document.getElementById("resultado").textContent =
        puntos >= 10 ? "VICTORIA" : "GAME OVER";

    document.getElementById("estrellas-final").textContent = calcularEstrellas(puntos);
    
    if (puntos >= 10) {
        sonidoWin.currentTime = 0;
        sonidoWin.play();
        lanzarConfeti();
    }

    guardarRanking();
    mostrarPantalla(pantallas.final);
}


function iniciarJuego(nivel) {

  nombreJugador = document.getElementById("nombre").value || "Jugador";
    puntos = 0;

    if (nivel === "facil") {
        preguntas = facil;
        tiempo = 60;
        tiempoMax = 60;
        vidas = 3;
    }

    if (nivel === "medio") {
        preguntas = medio;
        tiempo = 45;
        tiempoMax = 45;
        vidas = 2;
    }

    if (nivel === "dificil") {
        preguntas = dificil;
        tiempo = 30;
        tiempoMax = 30;
        vidas = 2;
    }

    puntosSpan.textContent = puntos;
    vidasSpan.textContent = vidas;
    tiempoSpan.textContent = tiempo;

    mostrarPantalla(pantallas.juego);
    nuevaPregunta();
    iniciarTiempo();
}

function calcularEstrellas(puntos) {
    if (puntos >= 10) return "⭐⭐⭐⭐⭐";
    if (puntos >= 7) return "⭐⭐⭐⭐☆";
    if (puntos >= 5) return "⭐⭐⭐☆☆";
    if (puntos >= 3) return "⭐⭐☆☆☆";
    return "⭐☆☆☆☆";
}

function lanzarConfeti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}

document.getElementById("btn-jugar").onclick = () => mostrarPantalla(pantallas.niveles);
document.getElementById("btn-instrucciones").onclick = () => mostrarPantalla(pantallas.instrucciones);
document.getElementById("btn-volver").onclick = () => mostrarPantalla(pantallas.inicio);

document.getElementById("btn-facil").onclick = () => iniciarJuego("facil");
document.getElementById("btn-medio").onclick = () => iniciarJuego("medio");
document.getElementById("btn-dificil").onclick = () => iniciarJuego("dificil");

document.getElementById("btn-reiniciar").onclick = () => location.reload();

document.getElementById("btn-limpiar").onclick = () => {
    localStorage.removeItem("ranking");
    document.getElementById("ranking").innerHTML = "";
};