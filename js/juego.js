// Pantallas
const inicio = document.getElementById("pantalla-inicio");
const instrucciones = document.getElementById("pantalla-instrucciones");
const juego = document.getElementById("pantalla-juego");
const final = document.getElementById("pantalla-final");

// Botones
document.getElementById("btn-iniciar").onclick = () => {
    inicio.style.display = "none";
    juego.style.display = "block";
};

document.getElementById("btn-instrucciones").onclick = () => {
    inicio.style.display = "none";
    instrucciones.style.display = "block";
};

document.getElementById("btn-volver").onclick = () => {
    instrucciones.style.display = "none";
    inicio.style.display = "block";
};

document.getElementById("btn-reiniciar").onclick = () => {
    location.reload();
};