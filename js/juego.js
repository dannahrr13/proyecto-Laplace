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

let nombreJugador = "";
let puntos = 0;
let vidas = 3;
let tiempo = 60;
let intervalo;
let preguntas = [];
let actual;
let tiempoMax = 60;

/* NIVELES */

const facil = [
    { pregunta: "L{ t }", correcta: "1/s^2", opciones: ["1/s","1/s^2","2/s^3"] },
    { pregunta: "L{ 1 }", correcta: "1/s", opciones: ["1/s","s","1/s^2"] },
    { pregunta: "L{ t^2 }", correcta: "2/s^3", opciones: ["2/s^3","1/s^2","6/s^4"] }
];

const medio = [
    { pregunta: "L{ t^2 }", correcta: "2/s^3", opciones: ["2/s^3","6/s^4","1/s^2","3/s^2"] },
    { pregunta: "L{ sin(t) }", correcta: "1/(s^2+1)", opciones: ["1/(s^2+1)","s/(s^2+1)","1/s","2/(s^2+1)"] },
    { pregunta: "L{ cos(t) }", correcta: "s/(s^2+1)", opciones: ["s/(s^2+1)","1/(s^2+1)","1/s","s/(s+1)"] }
];

const dificil = [
    { pregunta: "L{ e^t }", correcta: "1/(s-1)", opciones: ["1/(s-1)","1/(s+1)","s/(s^2+1)","1/(s-2)"] },
    { pregunta: "L{ e^{-t} }", correcta: "1/(s+1)", opciones: ["1/(s+1)","1/(s-1)","s/(s^2+1)","1/(s+2)"] },
    { pregunta: "L{ e^{2t} }", correcta: "1/(s-2)", opciones: ["1/(s-2)","1/(s+2)","2/(s-2)","s/(s^2+4)"] }
];

/* PANTALLAS */

function mostrarPantalla(p) {
    Object.values(pantallas).forEach(x => x.classList.add("oculto"));
    p.classList.remove("oculto");
}

/* MEZCLAR */

function mezclar(array) {
    return array.sort(() => Math.random() - 0.5);
}

/* PREGUNTA */

function nuevaPregunta() {

    actual = preguntas[Math.floor(Math.random() * preguntas.length)];

    ecuacion.style.opacity = "0";

    setTimeout(() => {

        ecuacion.textContent = actual.pregunta;
        opcionesDiv.innerHTML = "";

        const opcionesMezcladas = mezclar([...actual.opciones]);

        opcionesMezcladas.forEach(op => {

            const btn = document.createElement("button");
            btn.textContent = op;

            btn.onclick = () => {

                const botones = opcionesDiv.querySelectorAll("button");
                botones.forEach(b => b.disabled = true);

                if (op === actual.correcta) {
                    btn.classList.add("correcto");
                    puntos++;

                    for (let i = 0; i < 4; i++) {
                        const p = document.createElement("div");
                        p.className = "punto-flotante";
                        p.style.left = Math.random()*100+"%";
                        p.style.top = "50%";
                        document.body.appendChild(p);
                        setTimeout(()=>p.remove(),1000);
                    }

                } else {
                    btn.classList.add("incorrecto");
                    vidas--;

                    botones.forEach(b => {
                        if (b.textContent === actual.correcta) {
                            b.classList.add("correcto");
                        }
                    });

                    document.body.style.background = "#ff0000";
                    setTimeout(()=>document.body.style.background="",100);
                }

                puntosSpan.textContent = puntos;
                vidasSpan.textContent = vidas;

                setTimeout(() => {
                    if (vidas <= 0) terminarJuego();
                    else nuevaPregunta();
                }, 800);
            };

            opcionesDiv.appendChild(btn);
        });

        ecuacion.style.opacity = "1";

    }, 200);
}

/* TIEMPO */

function iniciarTiempo() {

    const barra = document.getElementById("barra-tiempo");
    barra.style.width = "100%";

    clearInterval(intervalo);

    intervalo = setInterval(() => {
        tiempo--;
        tiempoSpan.textContent = tiempo;

        barra.style.width = (tiempo / tiempoMax * 100) + "%";

        if (tiempo <= 0) terminarJuego();

    }, 1000);
}

/* RANKING */

function guardarRanking() {

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.push({ nombre: nombreJugador, puntos: puntos });

    ranking.sort((a,b)=>b.puntos-a.puntos);
    ranking = ranking.slice(0,5);

    localStorage.setItem("ranking", JSON.stringify(ranking));

    const lista = document.getElementById("ranking");
    lista.innerHTML = "";

    ranking.forEach(j => {
        const li = document.createElement("li");
        li.textContent = j.nombre + " - " + j.puntos;
        lista.appendChild(li);
    });
}

/* FINAL */

function terminarJuego() {

    clearInterval(intervalo);

    puntuacionFinal.textContent = puntos;

    if (puntos >= 10) {
        document.getElementById("resultado").textContent = "VICTORIA";
    } else {
        document.getElementById("resultado").textContent = "GAME OVER";
    }

    guardarRanking();
    mostrarPantalla(pantallas.final);
}

/* INICIAR */

function iniciarJuego(nivel) {

    nombreJugador = document.getElementById("nombre").value || "Jugador";

    puntos = 0;
    vidas = 3;

    if (nivel === "facil") {
        preguntas = facil;
        tiempo = 60;
        tiempoMax = 60;
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
        vidas = 1;
    }

    puntosSpan.textContent = puntos;
    vidasSpan.textContent = vidas;
    tiempoSpan.textContent = tiempo;

    mostrarPantalla(pantallas.juego);
    nuevaPregunta();
    iniciarTiempo();
}

/* BOTONES */

document.getElementById("btn-jugar").onclick = () => mostrarPantalla(pantallas.niveles);
document.getElementById("btn-instrucciones").onclick = () => mostrarPantalla(pantallas.instrucciones);
document.getElementById("btn-volver").onclick = () => mostrarPantalla(pantallas.inicio);

document.getElementById("btn-facil").onclick = () => iniciarJuego("facil");
document.getElementById("btn-medio").onclick = () => iniciarJuego("medio");
document.getElementById("btn-dificil").onclick = () => iniciarJuego("dificil");

document.getElementById("btn-reiniciar").onclick = () => location.reload();