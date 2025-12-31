document.addEventListener("DOMContentLoaded", () => {

const relogioEl = document.getElementById("relogioMundo");

let tempoMundo = {
  horas: 8,
  minutos: 0
};

const VELOCIDADE_TEMPO = 1; // 1 minuto do mundo
const INTERVALO_REAL = 20000; // 20 segundos reais

function atualizarRelogio() {
  const h = tempoMundo.horas.toString().padStart(2, "0");
  const m = tempoMundo.minutos.toString().padStart(2, "0");
  relogioEl.textContent = `🕒 ${h}:${m}`;
}

function avancarTempo() {
  tempoMundo.minutos += VELOCIDADE_TEMPO;

  if (tempoMundo.minutos >= 60) {
    tempoMundo.minutos = 0;
    tempoMundo.horas++;
  }

  if (tempoMundo.horas >= 24) {
    tempoMundo.horas = 0;
  }

  atualizarRelogio();
  atualizarMapaPorHorario(); // se essa função já existir
}

setInterval(avancarTempo, INTERVALO_REAL);

atualizarRelogio();
atualizarMapaPorHorario();



// Movimento do marcador com setas do teclado
const marcador = document.getElementById("marcador");
let posX = 50;
let posY = 50;

document.addEventListener("keydown", (e) => {
  const step = 2; // velocidade de movimento

  if (e.key === "ArrowUp") posY -= step;
  if (e.key === "ArrowDown") posY += step;
  if (e.key === "ArrowLeft") posX -= step;
  if (e.key === "ArrowRight") posX += step;

  marcador.style.top = posY + "%";
  marcador.style.left = posX + "%";
});

// Interação com hotspots
const hotspots = document.querySelectorAll(".hotspot");
const infoBox = document.getElementById("info-box");

hotspots.forEach(hotspot => {
  hotspot.addEventListener("click", () => {
    let info = hotspot.getAttribute("data-info");
    infoBox.textContent = "Você entrou em: " + info;

    // Aqui você pode redirecionar para outras páginas dependendo do hotspot
    // exemplo: if(hotspot.id === "cidade") window.location.href = "cidade.html";
  });
});
