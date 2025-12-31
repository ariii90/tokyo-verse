function abrirLivro() {
  document.getElementById('livro').classList.add('aberto');
}

const personagensInfo = {
  Ace: {
    imagem: "imagens/ace_normal.png",
    vida: 25,
    maxVida: 25,
    forca: 10,
    descricao: "Ágil e habilidoso."
  },
  Dizzy: {
    imagem: "imagens/dizzy_normal.png",
    vida: 25,
    maxVida: 25,
    forca: 12,
    descricao: "Mestre das ilusões."
  },
  Haku: {
    imagem: "imagens/haku_normal.png",
    vida: 15,
    maxVida: 15,
    forca: 14,
    descricao: "Guerreiro destemido."
  },
  Hyacine: {
    imagem: "imagens/hyacine_normal.png",
    vida: 8,
    maxVida: 8,
    forca: 8,
    descricao: "Mago das flores."
  },
  Mari: {
    imagem: "imagens/mari_normal.png",
    vida: 25,
    maxVida: 25,
    forca: 11,
    descricao: "Curandeira do grupo."
  },
  Mystery: {
    imagem: "imagens/mystery_normal.png",
    vida: 20,
    maxVida: 20,
    forca: 13,
    descricao: "Enigmático e furtivo."
  },
  Owen: {
    imagem: "imagens/owen_normal.png",
    vida: 10,
    maxVida: 10,
    forca: 9,
    descricao: "Inventor genial."
  },
  Shadow: {
    imagem: "imagens/shadow_normal.png",
    vida: 35,
    maxVida: 35,
    forca: 15,
    descricao: "Líder sombrio."
  }
};

function mostrarInfo(nome) {
  const p = personagensInfo[nome];
  if (!p) return;

  document.getElementById('infoPersonagem').innerHTML = `
    <h2>${nome}</h2>
    <img src="${p.imagem}" alt="${nome}" style="width:120px; border-radius:8px;"><br>
    <p><strong>Vida:</strong> ${p.vida} / ${p.maxVida}</p>
    <p><strong>Força:</strong> ${p.forca}</p>
    <p>${p.descricao}</p>
  `;
}
