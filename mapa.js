document.addEventListener("DOMContentLoaded", () => {

  /* ================= ESTADO ================= */
  let escala = 1;
  let posX = 0;
  let posY = 0;
  let arrastando = false;
  let inicioX = 0;
  let inicioY = 0;

  let chuvaAtiva = false;
  let modoAdicionarMarcador = false;
  let corMarcadorAtiva = "#ff0000";

  let tempoMundo = { horas: 8, minutos: 0 };

  /* ================= ELEMENTOS ================= */
  const mapaViewport = document.getElementById("mapa-viewport");
  const mapaImg = document.getElementById("mapa-img");
  const chuvaOverlay = document.getElementById("chuva-overlay");
  const marcadoresLayer = document.getElementById("marcadores-layer");

  const relogio = document.getElementById("relogioMundo");
  const btnMaisHora = document.getElementById("btnMaisHora");
  const btnMenosHora = document.getElementById("btnMenosHora");
  const btnMaisMin = document.getElementById("btnMaisMin");
  const btnMenosMin = document.getElementById("btnMenosMin");
  const btnChuva = document.getElementById("btnChuva");
  const btnAddMarcador = document.getElementById("btnAddMarcador");
  const seletorCor = document.getElementById("seletorCor");

  const zoomSlider = document.getElementById("zoom-slider");
  const zoomThumb = document.getElementById("zoom-thumb");

  /* ================= MAPAS ================= */
  const mapas = {
    manha: {
      normal: "mapa_manha.jpeg",
      chuva: "mapa_manha_chuva.jpeg"
    },
    dia: {
      normal: "mapa_dia.jpeg",
      chuva: "mapa_dia_chuva.jpeg"
    },
    tarde: {
      normal: "mapa_tarde.jpeg",
      chuva: "mapa_tarde_chuva.jpeg"
    },
    noite: {
      normal: "mapa_noite.jpeg",
      chuva: "mapa_noite_chuva.jpeg"
    }
  };

  /* ================= FUNÇÕES ================= */
  function atualizarRelogio() {
    relogio.textContent =
      `🕒 ${tempoMundo.horas.toString().padStart(2,"0")}:${tempoMundo.minutos.toString().padStart(2,"0")}`;
  }

  function aplicarTransform() {
    mapaViewport.style.transform =
      `translate(${posX}px, ${posY}px) scale(${escala})`;
  }

  function atualizarMapa() {
    let periodo;
    if (chuvaAtiva) {
      // Chuva: só dia ou noite
      if (tempoMundo.horas >= 5 && tempoMundo.horas < 18) {
        periodo = "dia";
      } else {
        periodo = "noite";
      }
      const novoMapa = mapas[periodo]["chuva"];
      if (mapaImg.dataset.atual === novoMapa) return;
      mapaImg.dataset.atual = novoMapa;
      mapaImg.style.opacity = 0;
      setTimeout(() => {
        mapaImg.src = novoMapa;
        mapaImg.style.opacity = 1;
      }, 300);
    } else {
      // Normal: todas as faixas
      if (tempoMundo.horas >= 5 && tempoMundo.horas <= 8) {
        periodo = "manha";
      } else if (tempoMundo.horas >= 9 && tempoMundo.horas <= 15) {
        periodo = "dia";
      } else if (tempoMundo.horas >= 16 && tempoMundo.horas <= 18) {
        periodo = "tarde";
      } else {
        periodo = "noite";
      }
      const novoMapa = mapas[periodo]["normal"];
      if (mapaImg.dataset.atual === novoMapa) return;
      mapaImg.dataset.atual = novoMapa;
      mapaImg.style.opacity = 0;
      setTimeout(() => {
        mapaImg.src = novoMapa;
        mapaImg.style.opacity = 1;
      }, 300);
    }
  }

  /* ================= PAN ================= */
  mapaViewport.addEventListener("mousedown", e => {
    arrastando = true;
    inicioX = e.clientX - posX;
    inicioY = e.clientY - posY;
  });

  window.addEventListener("mouseup", () => arrastando = false);

  window.addEventListener("mousemove", e => {
    if (!arrastando) return;
    posX = e.clientX - inicioX;
    posY = e.clientY - inicioY;
    aplicarTransform();
  });

  /* ================= ZOOM ================= */
  mapaViewport.addEventListener("wheel", e => {
    e.preventDefault();
    escala += e.deltaY > 0 ? -0.1 : 0.1;
    escala = Math.min(Math.max(escala, 0.8), 2.5);
    aplicarTransform();
    atualizarThumb();
  }, { passive: false });

  function atualizarThumb() {
    const pct = (escala - 0.8) / (2.5 - 0.8);
    zoomThumb.style.top = `${(1 - pct) * 160}px`;
  }

  let dragZoom = false;
  zoomThumb.onmousedown = e => {
    dragZoom = true;
    e.preventDefault();
  };

  window.onmousemove = e => {
    if (!dragZoom) return;
    const r = zoomSlider.getBoundingClientRect();
    let y = e.clientY - r.top;
    y = Math.max(0, Math.min(160, y));
    escala = 0.8 + (1 - y / 160) * (2.5 - 0.8);
    aplicarTransform();
    atualizarThumb();
  };

  window.onmouseup = () => dragZoom = false;

  /* ================= MARCADORES ================= */
  seletorCor.oninput = e => corMarcadorAtiva = e.target.value;

  btnAddMarcador.onclick = () => {
    modoAdicionarMarcador = !modoAdicionarMarcador;
    btnAddMarcador.classList.toggle("ativo", modoAdicionarMarcador);
  };

  mapaViewport.addEventListener("click", e => {
    if (!modoAdicionarMarcador) return;

    const rect = mapaViewport.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const marcador = document.createElement("div");
    marcador.className = "marcador";
    marcador.style.left = `${x}%`;
    marcador.style.top = `${y}%`;
    marcador.style.background = corMarcadorAtiva;
    marcador.style.color = corMarcadorAtiva;

    marcadoresLayer.appendChild(marcador);
  });

  /* ================= TEMPO ================= */
  function mudarTempo() {
    atualizarRelogio();
    atualizarMapa();
  }

  btnMaisHora.onclick = () => { tempoMundo.horas = (tempoMundo.horas+1)%24; mudarTempo(); };
  btnMenosHora.onclick = () => { tempoMundo.horas = (tempoMundo.horas+23)%24; mudarTempo(); };
  btnMaisMin.onclick = () => { tempoMundo.minutos = (tempoMundo.minutos+10)%60; mudarTempo(); };
  btnMenosMin.onclick = () => { tempoMundo.minutos = (tempoMundo.minutos+50)%60; mudarTempo(); };

  btnChuva.onclick = () => {
    chuvaAtiva = !chuvaAtiva;
    btnChuva.classList.toggle("ativo", chuvaAtiva);
    chuvaOverlay.classList.toggle("ativa", chuvaAtiva);
    atualizarMapa();
  };

  /* ================= BOTÃO DE PERSONAGENS ================= */
  const btnPersonagem = document.getElementById("btnPersonagem");
  btnPersonagem.onclick = () => {
    alert("Botão de personagens clicado!"); // Restaurar comportamento original
  };

  /* ================= INIT ================= */
  atualizarRelogio();
  atualizarMapa();
  aplicarTransform();
  atualizarThumb();
  console.log("Script carregado e executado.");
});
