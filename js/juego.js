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
let nivelActual = "";

function mezclarOpciones(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const aviso = document.createElement("div");
aviso.style.position = "fixed";
aviso.style.top = "-100px";
aviso.style.left = "50%";
aviso.style.transform = "translateX(-50%) scale(0.8)";
aviso.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
aviso.style.color = "#fff";
aviso.style.padding = "18px 30px";
aviso.style.borderRadius = "15px";
aviso.style.fontSize = "18px";
aviso.style.fontWeight = "bold";
aviso.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)";
aviso.style.transition = "all 0.4s ease";
aviso.style.zIndex = "9999";
document.body.appendChild(aviso);

function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.style.top = "30px";
    aviso.style.transform = "translateX(-50%) scale(1)";
    setTimeout(() => {
        aviso.style.top = "-100px";
        aviso.style.transform = "translateX(-50%) scale(0.8)";
    }, 2000);
}

const facil = [
{pregunta:"L{t}",correcta:"1/s^2",opciones:["1/s","1/s^2","2/s^3","3/s^2"]},
{pregunta:"L{1}",correcta:"1/s",opciones:["1/s","s","1/s^2","2/s"]},
{pregunta:"L{t^2}",correcta:"2/s^3",opciones:["2/s^3","1/s^2","6/s^4","3/s^3"]},
{pregunta:"L{3}",correcta:"3/s",opciones:["3/s","1/s","3/s^2","2/s"]},
{pregunta:"L{2}",correcta:"2/s",opciones:["2/s","1/s","2/s^2","3/s"]},
{pregunta:"L{t^3}",correcta:"6/s^4",opciones:["6/s^4","3/s^3","1/s^2","24/s^5"]},
{pregunta:"L{5}",correcta:"5/s",opciones:["5/s","1/s","5/s^2","4/s"]},
{pregunta:"L{t^4}",correcta:"24/s^5",opciones:["24/s^5","6/s^4","1/s^2","120/s^6"]},
{pregunta:"L{7}",correcta:"7/s",opciones:["7/s","1/s","7/s^2","6/s"]},
{pregunta:"L{t^5}",correcta:"120/s^6",opciones:["120/s^6","24/s^5","1/s^2","720/s^7"]},
{pregunta:"L{4}",correcta:"4/s",opciones:["4/s","1/s","4/s^2","5/s"]},
{pregunta:"L{t^6}",correcta:"720/s^7",opciones:["720/s^7","120/s^6","1/s^2","5040/s^8"]},
{pregunta:"L{6}",correcta:"6/s",opciones:["6/s","1/s","6/s^2","7/s"]},
{pregunta:"L{t^7}",correcta:"5040/s^8",opciones:["5040/s^8","720/s^7","1/s^2","40320/s^9"]},
{pregunta:"L{8}",correcta:"8/s",opciones:["8/s","1/s","8/s^2","9/s"]},
{pregunta:"L{t^8}",correcta:"40320/s^9",opciones:["40320/s^9","5040/s^8","1/s^2","362880/s^10"]},
{pregunta:"L{9}",correcta:"9/s",opciones:["9/s","1/s","9/s^2","8/s"]},
{pregunta:"L{t^9}",correcta:"362880/s^10",opciones:["362880/s^10","40320/s^9","1/s^2","3628800/s^11"]},
{pregunta:"L{10}",correcta:"10/s",opciones:["10/s","1/s","10/s^2","9/s"]},
{pregunta:"L{t^{10}}",correcta:"3628800/s^11",opciones:["3628800/s^11","362880/s^10","1/s^2","39916800/s^12"]}
];

const medio = [
{pregunta:"L{sin(t)}",correcta:"1/(s^2+1)",opciones:["1/(s^2+1)","s/(s^2+1)","1/s","2/(s^2+1)"]},
{pregunta:"L{cos(t)}",correcta:"s/(s^2+1)",opciones:["s/(s^2+1)","1/(s^2+1)","1/s","2s/(s^2+1)"]},
{pregunta:"L{sin(2t)}",correcta:"2/(s^2+4)",opciones:["2/(s^2+4)","1/(s^2+4)","s/(s^2+4)","4/(s^2+4)"]},
{pregunta:"L{cos(2t)}",correcta:"s/(s^2+4)",opciones:["s/(s^2+4)","1/(s^2+4)","2/(s^2+4)","2s/(s^2+4)"]},
{pregunta:"L{sin(3t)}",correcta:"3/(s^2+9)",opciones:["3/(s^2+9)","1/(s^2+9)","s/(s^2+9)","9/(s^2+9)"]},
{pregunta:"L{cos(3t)}",correcta:"s/(s^2+9)",opciones:["s/(s^2+9)","1/(s^2+9)","3/(s^2+9)","3s/(s^2+9)"]},
{pregunta:"L{4sin(t)}",correcta:"4/(s^2+1)",opciones:["4/(s^2+1)","1/(s^2+1)","4s/(s^2+1)","2/(s^2+1)"]},
{pregunta:"L{5cos(t)}",correcta:"5s/(s^2+1)",opciones:["5s/(s^2+1)","s/(s^2+1)","5/(s^2+1)","2s/(s^2+1)"]},
{pregunta:"L{sin(4t)}",correcta:"4/(s^2+16)",opciones:["4/(s^2+16)","1/(s^2+16)","s/(s^2+16)","16/(s^2+16)"]},
{pregunta:"L{cos(4t)}",correcta:"s/(s^2+16)",opciones:["s/(s^2+16)","1/(s^2+16)","4/(s^2+16)","4s/(s^2+16)"]},
{pregunta:"L{sin(5t)}",correcta:"5/(s^2+25)",opciones:["5/(s^2+25)","1/(s^2+25)","s/(s^2+25)","25/(s^2+25)"]},
{pregunta:"L{cos(5t)}",correcta:"s/(s^2+25)",opciones:["s/(s^2+25)","1/(s^2+25)","5/(s^2+25)","5s/(s^2+25)"]},
{pregunta:"L{6sin(t)}",correcta:"6/(s^2+1)",opciones:["6/(s^2+1)","1/(s^2+1)","6s/(s^2+1)","3/(s^2+1)"]},
{pregunta:"L{7cos(t)}",correcta:"7s/(s^2+1)",opciones:["7s/(s^2+1)","s/(s^2+1)","7/(s^2+1)","3s/(s^2+1)"]},
{pregunta:"L{sin(6t)}",correcta:"6/(s^2+36)",opciones:["6/(s^2+36)","1/(s^2+36)","s/(s^2+36)","36/(s^2+36)"]},
{pregunta:"L{cos(6t)}",correcta:"s/(s^2+36)",opciones:["s/(s^2+36)","1/(s^2+36)","6/(s^2+36)","6s/(s^2+36)"]},
{pregunta:"L{sin(7t)}",correcta:"7/(s^2+49)",opciones:["7/(s^2+49)","1/(s^2+49)","s/(s^2+49)","49/(s^2+49)"]},
{pregunta:"L{cos(7t)}",correcta:"s/(s^2+49)",opciones:["s/(s^2+49)","1/(s^2+49)","7/(s^2+49)","7s/(s^2+49)"]},
{pregunta:"L{sin(8t)}",correcta:"8/(s^2+64)",opciones:["8/(s^2+64)","1/(s^2+64)","s/(s^2+64)","64/(s^2+64)"]},
{pregunta:"L{cos(8t)}",correcta:"s/(s^2+64)",opciones:["s/(s^2+64)","1/(s^2+64)","8/(s^2+64)","8s/(s^2+64)"]}
];

const dificil = [
{pregunta:"L{e^t}",correcta:"1/(s-1)",opciones:["1/(s-1)","1/(s+1)","2/(s-1)","s/(s-1)"]},
{pregunta:"L{e^{2t}}",correcta:"1/(s-2)",opciones:["1/(s-2)","1/(s+2)","2/(s-2)","s/(s-2)"]},
{pregunta:"L{e^{3t}}",correcta:"1/(s-3)",opciones:["1/(s-3)","1/(s+3)","3/(s-3)","s/(s-3)"]},
{pregunta:"L{e^{-t}}",correcta:"1/(s+1)",opciones:["1/(s+1)","1/(s-1)","2/(s+1)","s/(s+1)"]},
{pregunta:"L{e^{-2t}}",correcta:"1/(s+2)",opciones:["1/(s+2)","1/(s-2)","2/(s+2)","s/(s+2)"]},
{pregunta:"L{2e^t}",correcta:"2/(s-1)",opciones:["2/(s-1)","1/(s-1)","2/(s+1)","3/(s-1)"]},
{pregunta:"L{3e^t}",correcta:"3/(s-1)",opciones:["3/(s-1)","1/(s-1)","3/(s+1)","2/(s-1)"]},
{pregunta:"L{4e^t}",correcta:"4/(s-1)",opciones:["4/(s-1)","1/(s-1)","4/(s+1)","2/(s-1)"]},
{pregunta:"L{5e^t}",correcta:"5/(s-1)",opciones:["5/(s-1)","1/(s-1)","5/(s+1)","3/(s-1)"]},
{pregunta:"L{te^t}",correcta:"1/(s-1)^2",opciones:["1/(s-1)^2","1/(s-1)","2/(s-1)^2","s/(s-1)^2"]},
{pregunta:"L{te^{2t}}",correcta:"1/(s-2)^2",opciones:["1/(s-2)^2","1/(s-2)","2/(s-2)^2","s/(s-2)^2"]},
{pregunta:"L{te^{-t}}",correcta:"1/(s+1)^2",opciones:["1/(s+1)^2","1/(s+1)","2/(s+1)^2","s/(s+1)^2"]},
{pregunta:"L{e^{4t}}",correcta:"1/(s-4)",opciones:["1/(s-4)","1/(s+4)","4/(s-4)","s/(s-4)"]},
{pregunta:"L{e^{-4t}}",correcta:"1/(s+4)",opciones:["1/(s+4)","1/(s-4)","4/(s+4)","s/(s+4)"]},
{pregunta:"L{6e^t}",correcta:"6/(s-1)",opciones:["6/(s-1)","1/(s-1)","6/(s+1)","3/(s-1)"]},
{pregunta:"L{7e^t}",correcta:"7/(s-1)",opciones:["7/(s-1)","1/(s-1)","7/(s+1)","4/(s-1)"]},
{pregunta:"L{e^{5t}}",correcta:"1/(s-5)",opciones:["1/(s-5)","1/(s+5)","5/(s-5)","s/(s-5)"]},
{pregunta:"L{e^{-5t}}",correcta:"1/(s+5)",opciones:["1/(s+5)","1/(s-5)","5/(s+5)","s/(s+5)"]},
{pregunta:"L{8e^t}",correcta:"8/(s-1)",opciones:["8/(s-1)","1/(s-1)","8/(s+1)","4/(s-1)"]},
{pregunta:"L{9e^t}",correcta:"9/(s-1)",opciones:["9/(s-1)","1/(s-1)","9/(s+1)","5/(s-1)"]}
];

function mostrarPantalla(p) {
    Object.values(pantallas).forEach(x => x.classList.add("oculto"));
    setTimeout(() => p.classList.remove("oculto"), 50);
}

function nuevaPregunta() {
    actual = preguntas[Math.floor(Math.random()*preguntas.length)];
    ecuacion.textContent = actual.pregunta;
    opcionesDiv.innerHTML = "";

    let opcionesMezcladas = mezclarOpciones([...actual.opciones]);

    opcionesMezcladas.forEach(op => {
        const btn = document.createElement("button");
        btn.textContent = op;

        btn.onclick = () => {

            if (op === actual.correcta) {
                puntos++;
                btn.classList.add("correcto");
                sonidoCorrecto.currentTime = 0;
                sonidoCorrecto.play();

                if (
                    (nivelActual === "facil" && puntos % 3 === 0) ||
                    (nivelActual === "medio" && puntos % 5 === 0) ||
                    (nivelActual === "dificil" && puntos % 10 === 0)
                ) {

                    if (nivelActual === "facil") {
                        vidas++;
                        mostrarAviso("🎁 Fácil: +1 vida");
                    }

                    if (nivelActual === "medio") {
                        tiempo += 8;
                        mostrarAviso("🎁 Medio: +8 segundos");
                    }

                    if (nivelActual === "dificil") {
                        vidas++;
                        tiempo += 5;
                        mostrarAviso("🎁 Difícil: +1 vida y +5s");
                    }
                }

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
    nivelActual = nivel;

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