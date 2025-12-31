// ABRIR RUNAS AO CLICAR NA CAPA

let capaSelecionada = null;
let combinacaoEscolhida = [];
let travarRunas = false;

// senhas das runas por capa/personagem
const senhasRunas = {
  capa1: ["runa1", "runa3", "runa5"],
  capa2: ["runa2", "runa4", "runa7"],
  capa3: ["runa1", "runa6", "runa8"]
};

// clique nas capas
document.querySelectorAll(".capa").forEach(capa => {
  capa.addEventListener("click", () => {
    capaSelecionada = capa.id;
    combinacaoEscolhida = [];

    document.getElementById("runasContainer").style.display = "block";

    window.scrollTo({
      top: document.getElementById("runasContainer").offsetTop,
      behavior: "smooth"
    });

    resetRunas();
  });
});

// SELEÇÃO DAS RUNAS

document.querySelectorAll(".runa").forEach(runa => {
  runa.addEventListener("click", () => {
    if (travarRunas) return;

    if (combinacaoEscolhida.length < 3) {
      combinacaoEscolhida.push(runa.id);
      runa.classList.add("ativa");
    }

    if (combinacaoEscolhida.length === 3) {
      verificarSenha();
    }
  });
});

// VERIFICAR SENHA

function verificarSenha() {
  const senhaCorreta = senhasRunas[capaSelecionada];
  const correto = senhaCorreta.every((id, i) => id === combinacaoEscolhida[i]);

  if (correto) {
    travarRunas = true;

    //  MOSTRAR O SELO DO PERSONAGEM
    const selo = document.getElementById("selo-personagem");
    selo.src = "imagem.combinacao1.jpg"; // depois troca por cada player
    selo.style.opacity = "1";

    // animação de teleporte
    document.getElementById("runasContainer").classList.add("teleporte");

    setTimeout(() => {
      window.location.href = "../html/mapa.html";
    }, 2000);

  } else {
    document.getElementById("runasContainer").classList.add("erro");

    setTimeout(() => {
      resetRunas();
    }, 1000);
  }
}

// RESET

function resetRunas() {
  combinacaoEscolhida = [];
  travarRunas = false;

  document.querySelectorAll(".runa").forEach(r =>
    r.classList.remove("ativa")
  );

  const selo = document.getElementById("selo-personagem");
  if (selo) selo.style.opacity = "0";

  const container = document.getElementById("runasContainer");
  container.classList.remove("erro");
  container.classList.remove("teleporte");
}
