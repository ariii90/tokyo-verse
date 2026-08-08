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

  /* ================= RELÓGIO ================= */

  function atualizarRelogio() {
    const horas = String(tempoMundo.horas).padStart(2, "0");
    const minutos = String(tempoMundo.minutos).padStart(2, "0");
    relogio.textContent = `🕒 ${horas}:${minutos}`;
  }

  function atualizarMapa() {

    const horas = tempoMundo.horas;
    let novoMapa;

    if (chuvaAtiva) {

      if (horas >= 5 && horas <= 17) {
        novoMapa = "chuva_dia_novo.jpeg";
      } else {
        novoMapa = "chuva_noite_novo.jpeg";
      }

    } else {

      if (horas >= 5 && horas <= 8) {
        novoMapa = "mapa_manha_novo.jpeg";
      }
      else if (horas >= 9 && horas <= 12) {
        novoMapa = "mapa_dia_novo.jpeg";
      }
      else if (horas >= 13 && horas <= 17) {
        novoMapa = "mapa_tarde_novo.jpeg";
      }
      else {
        novoMapa = "mapa_noite_novo.jpeg";
      }

    }

    if (mapaImg.src.includes(novoMapa)) return;

    mapaImg.style.opacity = 0;

    setTimeout(() => {
      mapaImg.src = novoMapa;
      mapaImg.style.opacity = 1;
    }, 200);

  }

  function atualizarTempo() {

    tempoMundo.minutos++;

    if (tempoMundo.minutos >= 60) {
      tempoMundo.minutos = 0;
      tempoMundo.horas++;

      if (tempoMundo.horas >= 24) tempoMundo.horas = 0;
    }

    atualizarRelogio();
    atualizarMapa();

  }

  setInterval(atualizarTempo, 60000);

  /* ================= BOTÕES TEMPO ================= */

  btnMaisHora.onclick = () => {

    tempoMundo.horas = (tempoMundo.horas + 1) % 24;
    atualizarRelogio();
    atualizarMapa();

  };

  btnMenosHora.onclick = () => {

    tempoMundo.horas = (tempoMundo.horas - 1 + 24) % 24;
    atualizarRelogio();
    atualizarMapa();

  };

  btnMaisMin.onclick = () => {

    tempoMundo.minutos = (tempoMundo.minutos + 10) % 60;
    atualizarRelogio();
    atualizarMapa();

  };

  btnMenosMin.onclick = () => {

    tempoMundo.minutos = (tempoMundo.minutos - 10 + 60) % 60;
    atualizarRelogio();
    atualizarMapa();

  };

  /* ================= RELÓGIO MODAL ================= */

  const modal = document.getElementById("time-modal");
  const inputHora = document.getElementById("time-input");
  const btnSet = document.getElementById("set-time-btn");
  const btnCancel = document.getElementById("cancel-time-btn");

  relogio.addEventListener("click", () => {

    inputHora.value =
      `${String(tempoMundo.horas).padStart(2,"0")}:${String(tempoMundo.minutos).padStart(2,"0")}`;

    modal.style.display = "block";

  });

  btnCancel.addEventListener("click", () => {
    modal.style.display = "none";
  });

  btnSet.addEventListener("click", () => {

    const valor = inputHora.value;

    if (!valor) return;

    const partes = valor.split(":");

    tempoMundo.horas = parseInt(partes[0]);
    tempoMundo.minutos = parseInt(partes[1]);

    atualizarRelogio();
    atualizarMapa();

    modal.style.display = "none";

  });

  /* ================= CHUVA ================= */

  btnChuva.onclick = () => {

    chuvaAtiva = !chuvaAtiva;
    btnChuva.classList.toggle("ativo", chuvaAtiva);

    const chuvaOverlay = document.getElementById("chuva-overlay");

    if (chuvaAtiva) {
      chuvaOverlay.classList.add("ativa");
    } else {
      chuvaOverlay.classList.remove("ativa");
    }

    atualizarMapa();

  };

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

  function aplicarTransform() {

    mapaViewport.style.transform =
      `translate(${posX}px, ${posY}px) scale(${escala})`;

  }

  /* ================= ZOOM ================= */

  function atualizarThumb() {

    const pct = (escala - 0.8) / (2.5 - 0.8);
    zoomThumb.style.top = `${(1 - pct) * 160}px`;

  }

  mapaViewport.addEventListener("wheel", e => {

    e.preventDefault();

    escala += e.deltaY > 0 ? -0.1 : 0.1;
    escala = Math.min(Math.max(escala, 0.8), 2.5);

    aplicarTransform();
    atualizarThumb();

  }, { passive: false });

  let dragZoom = false;

  zoomThumb.addEventListener("mousedown", e => {

    dragZoom = true;
    e.preventDefault();

  });

  window.addEventListener("mousemove", e => {

    if (!dragZoom) return;

    const rect = zoomSlider.getBoundingClientRect();

    let y = e.clientY - rect.top;

    y = Math.max(0, Math.min(160, y));

    escala = 0.8 + (1 - y / 160) * (2.5 - 0.8);

    aplicarTransform();
    atualizarThumb();

  });

  window.addEventListener("mouseup", () => dragZoom = false);

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

  /* ================= SISTEMA DE VIDA ================= */

  const players = document.querySelectorAll(".vida-player");

  players.forEach(player => {

    const barra = player.querySelector(".vida-barra");

    const fill = document.createElement("div");
    fill.className = "vida-preenchimento";
    barra.appendChild(fill);

    let vida = 100;

    barra.addEventListener("click", () => {

      const novaVida = prompt("Vida do personagem (0-100):", vida);

      if (novaVida === null) return;

      vida = Math.max(0, Math.min(100, parseInt(novaVida)));

      fill.style.width = vida + "%";

      const img = player.querySelector(".player-img");

      if (vida <= 50) {
        img.src = "personagem_dano.png";
      } else {
        img.src = "personagem_ok.png";
      }

    });

  });

  /* Função para atualizar a imagem do personagem com base na vida */
  function atualizarImagemPersonagem(vida, playerImg) {
    if (vida > 50) {
      playerImg.src = "owen_normal.jpg";
    } else {
      playerImg.src = "owen_machucada.jpg";
    }
  }

  /* Atualizar barra de vida e imagem do personagem */
  function atualizarVida(vida, player) {
    const vidaBarra = player.querySelector('.vida-barra');
    const playerImg = player.querySelector('.player-img');

    vidaBarra.style.width = `${vida}%`;
    atualizarImagemPersonagem(vida, playerImg);
  }

  /* Exemplo de uso */
  const vidaPlayers = document.querySelectorAll('.vida-player');
  vidaPlayers.forEach((player, index) => {
    player.addEventListener('click', () => {
      const novaVida = prompt("Vida do personagem (0-100):", "100");
      if (novaVida !== null) {
        atualizarVida(parseInt(novaVida, 10), player);
      }
    });
  });

  /* ================= INIT ================= */

  atualizarRelogio();
  atualizarMapa();
  aplicarTransform();
  atualizarThumb();

});

/* ================= VIDA ================= */

let barraAtual = null;

function iniciarSistemaVida(){

  document.querySelectorAll(".vida-barra").forEach(barra => {

    atualizarBarra(barra);

    barra.addEventListener("click", () => {
      abrirModalVida(barra);
    });

  });

}

function atualizarBarra(barra){
  const preenchimento = barra.querySelector(".vida-preenchimento");
  const vida = parseInt(barra.dataset.vida);

  preenchimento.style.width = vida + "%";

  const img = barra.parentElement.querySelector(".player-img");
  const nome = img.dataset.nome;

  if(vida <= 50){
    img.src = nome + "_machucada.jpg";
  }else{
    img.src = nome + "_normal.jpg";
  }
}

function abrirModalVida(barra){
  barraAtual = barra;

  document.getElementById("vida-input").value = barra.dataset.vida;
  document.getElementById("vida-modal").style.display = "block";
}

document.getElementById("vida-ok").onclick = () => {
  let valor = parseInt(document.getElementById("vida-input").value);

  if(isNaN(valor) || valor < 0 || valor > 100){
    alert("Valor inválido");
    return;
  }

  barraAtual.dataset.vida = valor;
  atualizarBarra(barraAtual);
  fecharModal();
};

document.getElementById("vida-cancel").onclick = fecharModal;

function fecharModal(){
  document.getElementById("vida-modal").style.display = "none";
}

/* INICIA SEM QUEBRAR O RESTO */
document.addEventListener("DOMContentLoaded", iniciarSistemaVida);