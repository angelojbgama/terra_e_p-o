/*******************************************************
 * 1) Mapeamento de Ícones -> Font Awesome
 *******************************************************/
const IconMapping = {
  pizza: "fas fa-pizza-slice",
  burger: "fas fa-burger",
  hotdog: "fas fa-hotdog",
  fries: "fas fa-french-fries",
  sushi: "fas fa-sushi",
  fish: "fas fa-fish",
  bacon: "fas fa-bacon",
  egg: "fas fa-egg",
  cheese: "fas fa-cheese",
  bread: "fas fa-bread-slice",
  croissant: "fas fa-croissant",
  carrot: "fas fa-carrot",
  apple: "fas fa-apple-whole",
  lemon: "fas fa-lemon",
  pepperHot: "fas fa-pepper-hot",
  seedling: "fas fa-seedling",
  drumstick: "fas fa-drumstick-bite",
  shrimp: "fas fa-shrimp",
  coffee: "fas fa-mug-saucer",
  tea: "fas fa-mug-hot",
  soda: "fas fa-cup-straw",
  beer: "fas fa-beer-mug-empty",
  wine: "fas fa-wine-bottle",
  cocktail: "fas fa-martini-glass-citrus",
  cupcake: "fas fa-cupcake",
  iceCream: "fas fa-ice-cream",
  cake: "fas fa-cake-candles",
  home: "fas fa-house",
  user: "fas fa-user",
  envelope: "fas fa-envelope",
  phone: "fas fa-phone",
  mapMarker: "fas fa-map-marker-alt",
  shoppingCart: "fas fa-shopping-cart",
  check: "fas fa-check",
  times: "fas fa-xmark",
  plus: "fas fa-plus",
  minus: "fas fa-minus",
  arrowRight: "fas fa-arrow-right",
  arrowLeft: "fas fa-arrow-left",
  gear: "fas fa-gear",
  search: "fas fa-magnifying-glass",
  trash: "fas fa-trash",
  edit: "fas fa-pen-to-square",
  save: "fas fa-floppy-disk",
  folder: "fas fa-folder",
  file: "fas fa-file",
  download: "fas fa-download",
  upload: "fas fa-upload",
  github: "fab fa-github",
  linkedin: "fab fa-linkedin",
  instagram: "fab fa-instagram",
  facebook: "fab fa-facebook",
  twitter: "fab fa-twitter",
  default: "fas fa-question",
};

/*******************************************************
 * 2) Detectar idioma e carregar JSON do perfil
 *******************************************************/
async function fetchProfileData() {
  let language = navigator.language || navigator.userLanguage;
  language = language.substring(0, 2).toLowerCase(); // 'pt', 'en', 'es', etc.

  const supportedLanguages = ["pt", "en", "es"];
  if (!supportedLanguages.includes(language)) {
    language = "pt";
  }

  const url = `data/profile_${language}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao carregar o JSON: " + response.statusText);
    }
    const profileData = await response.json();
    return profileData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Variável global para armazenar os dados do perfil (se precisar em outro lugar)
let profileDataGlobal = null;

/*******************************************************
 * 3) Helper Function para acessar textos do JSON
 *******************************************************/
function t(key) {
  return profileDataGlobal && profileDataGlobal.texts && profileDataGlobal.texts[key]
    ? profileDataGlobal.texts[key]
    : key;
}

/*******************************************************
 * 4) Atualizar elementos de PERFIL
 *******************************************************/
function updatePerfil(perfilData) {
  if (!perfilData) return;

  // Foto
  const photoElem = document.getElementById("profile-photo");
  if (photoElem && perfilData.foto) {
    photoElem.src = perfilData.foto;
    photoElem.alt = perfilData.titulo || t("tituloPagina");
  }

  // Título
  const tituloElem = document.getElementById("perfil-titulo");
  if (tituloElem) {
    tituloElem.innerText = perfilData.titulo || t("tituloPagina");
  }

  // Slogan
  const sloganElem = document.getElementById("perfil-slogan");
  if (sloganElem) {
    sloganElem.innerText = perfilData.slogan || "";
  }

  // Local
  const localElem = document.getElementById("perfil-local-link");
  if (localElem && perfilData.local) {
    localElem.innerText = perfilData.local.texto || "";
    localElem.href = perfilData.local.link || "#";
    if (perfilData.local.link) {
      localElem.style.cursor = "pointer";
      localElem.setAttribute("target", "_blank");
      localElem.setAttribute("rel", "noopener noreferrer");
    }
  }

  // WhatsApp
  const whatsElem = document.getElementById("perfil-whatsapp");
  if (whatsElem) {
    whatsElem.innerText = perfilData.contatoWhats || "";
    const phoneNumber = (perfilData.contatoWhats || "").replace(/\D/g, "");
    whatsElem.href = `https://wa.me/55${phoneNumber}`;
  }

  // Email
  const emailElem = document.getElementById("perfil-email");
  if (emailElem) {
    emailElem.innerText = perfilData.email || "";
    emailElem.href = `mailto:${perfilData.email}`;
  }

  // Observações Iniciais
  const obsList = document.getElementById("perfil-observacoesIniciais");
  if (obsList && Array.isArray(perfilData.observacoesIniciais)) {
    obsList.innerHTML = "";
    perfilData.observacoesIniciais.forEach((obs) => {
      const li = document.createElement("li");
      li.innerText = obs;
      obsList.appendChild(li);
    });
  }

  // Título da página (opcional)
  if (perfilData.titulo || t("tituloPagina")) {
    document.title = perfilData.titulo || t("tituloPagina");
  }
}

/*******************************************************
 * 5) Criar dinamicamente o CARDÁPIO (categorias)
 *******************************************************/
function updateCategorias(categorias) {
  if (!categorias) return;

  const cardapioSection = document.getElementById("cardapio");
  if (!cardapioSection) return;
  cardapioSection.innerHTML = "";

  categorias.forEach((categoria) => {
    // Bloco do acordeon
    const acordeonSection = document.createElement("section");
    acordeonSection.classList.add("acordeon");

    // Botão de abrir/fechar
    const triggerButton = document.createElement("button");
    triggerButton.type = "button";
    triggerButton.classList.add("trigger");

    // Título do acordeon
    const h2 = document.createElement("h2");
    h2.innerHTML = `<i class="fa-solid fa-utensils"></i> ${categoria.nome}`;
    triggerButton.appendChild(h2);

    // Conteúdo do acordeon
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content");

    // Subtítulo (opcional)
    if (categoria.subtitulo) {
      const catSubtitle = document.createElement("p");
      catSubtitle.classList.add("subtitulo");
      catSubtitle.innerText = categoria.subtitulo;
      contentDiv.appendChild(catSubtitle);
    }

    // Função auxiliar para criar um <li> com item do cardápio
    function criarItemCardapio(item) {
      const li = document.createElement("li");

      // Imagem
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.nome;
      img.classList.add("menu-item-image");
      li.appendChild(img);

      // Ícone
      const iconClass =
        item.icon ||
        IconMapping[item.nome.toLowerCase().replace(/\s+/g, "")] ||
        IconMapping.default;
      const iconElem = document.createElement("i");
      iconElem.className = iconClass + " menu-item-icon";
      iconElem.setAttribute("aria-hidden", "true");
      li.appendChild(iconElem);

      // Nome
      const strong = document.createElement("strong");
      strong.innerText = item.nome;
      li.appendChild(strong);

      // Preço
      const precoStr = getPreco(item);
      if (precoStr) {
        const span = document.createElement("span");
        span.classList.add("preco");
        span.innerText = precoStr;
        li.appendChild(span);
      }

      // Descrição
      if (item.descricao) {
        li.appendChild(document.createElement("br"));
        const em = document.createElement("em");
        em.innerText = item.descricao;
        li.appendChild(em);
      }

      // Botão Adicionar ao Carrinho
      const addBtn = document.createElement("button");
      addBtn.classList.add("btn-add-cart");
      addBtn.innerHTML = `${t('adicionarAoCarrinho')} <i class="fa-solid fa-cart-plus"></i>`;

      // Verifica se o item tem múltiplos preços
      const hasMultiplePrices =
        (typeof item.precoGrande === "number" &&
          typeof item.precoPequena === "number") ||
        (item.precoGrande && item.precoPequena);

      if (hasMultiplePrices) {
        // Se tiver múltiplos preços, abre o modal de seleção
        addBtn.addEventListener("click", (e) => {
          openPriceModal(item, e.currentTarget);
        });
      } else {
        // Se tiver um único preço, adiciona diretamente
        addBtn.addEventListener("click", (e) => {
          addToCart(item, null, e.currentTarget);
        });
      }

      li.appendChild(addBtn);

      return li;
    }

    // Subcategorias
    if (Array.isArray(categoria.subcategorias)) {
      categoria.subcategorias.forEach((subcat) => {
        const subcatTitle = document.createElement("h3");
        subcatTitle.innerText = subcat.nome;
        contentDiv.appendChild(subcatTitle);

        const ulSub = document.createElement("ul");
        subcat.itens.forEach((item) => {
          const li = criarItemCardapio(item);
          ulSub.appendChild(li);
        });
        contentDiv.appendChild(ulSub);
      });
    }

    // Itens diretos (sem subcategorias)
    if (Array.isArray(categoria.itens)) {
      const ul = document.createElement("ul");
      categoria.itens.forEach((item) => {
        const li = criarItemCardapio(item);
        ul.appendChild(li);
      });
      contentDiv.appendChild(ul);
    }

    // Toggle do acordeon
    triggerButton.addEventListener("click", () => {
      acordeonSection.classList.toggle("open");
    });

    // Monta e adiciona
    acordeonSection.appendChild(triggerButton);
    acordeonSection.appendChild(contentDiv);
    cardapioSection.appendChild(acordeonSection);
  });
}

/*******************************************************
 * 6) Função para obter string de preço
 *******************************************************/
function getPreco(item) {
  if (typeof item.preco === "number") {
    return `R$ ${item.preco.toFixed(2)}`;
  }
  if (
    typeof item.precoGrande === "number" &&
    typeof item.precoPequena === "number"
  ) {
    return `${t('grande')}: R$ ${item.precoGrande.toFixed(2)} / ${t('pequena')}: R$ ${item.precoPequena.toFixed(2)}`;
  }
  return "";
}

/*******************************************************
 * 7) Rodapé (WhatsApp, Instagram)
 *******************************************************/
function updateFooterLinks(footerData) {
  if (!footerData) return;

  // WhatsApp
  const footerWhatsApp = document.getElementById("footer-whatsapp");
  if (footerWhatsApp && footerData.contatoWhats) {
    const phoneNumber = footerData.contatoWhats.replace(/\D/g, "");
    footerWhatsApp.href = `https://wa.me/55${phoneNumber}`;
  }

  // Instagram
  const footerInsta = document.getElementById("footer-instagram");
  if (footerInsta && footerData.contatoInsta) {
    const instaUser = footerData.contatoInsta.replace("@", "");
    footerInsta.href = `https://instagram.com/${instaUser}`;
  }
}

/*******************************************************
 * 8) Tema Claro/Escuro
 *******************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  const toggleIcon = themeToggle.querySelector("i");
  const currentTheme = localStorage.getItem("theme") || "dark";

  const updateIcon = (theme) => {
    toggleIcon.classList.remove("fa-toggle-off", "fa-toggle-on");
    if (theme === "light") {
      toggleIcon.classList.add("fa-toggle-on");
    } else {
      toggleIcon.classList.add("fa-toggle-off");
    }
  };

  // Aplica o tema salvo
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.add("dark-theme");
  }
  updateIcon(currentTheme);

  // Clique para alternar
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");
    const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
    updateIcon(theme);
    localStorage.setItem("theme", theme);
  });
});

/*******************************************************
 * 9) Balão de Imagem (Mobile)
 *******************************************************/
function closeAllImageBalloons() {
  const balloons = document.querySelectorAll(".image-balloon");
  balloons.forEach((balloon) => balloon.remove());
}

function initializeImageBalloons() {
  const isSmallScreen = () => window.innerWidth < 600;
  const actionIcons = document.querySelectorAll(".menu-item-icon");

  actionIcons.forEach((icon) => {
    icon.addEventListener("click", (event) => {
      if (!isSmallScreen()) return;

      event.stopPropagation();
      closeAllImageBalloons();

      const productItem = icon.closest("li");
      const productImage = productItem.querySelector(".menu-item-image");
      const imageSrc = productImage ? productImage.src : null;
      const imageAlt = productImage ? productImage.alt : t("fotoPerfil");

      if (!imageSrc) return;

      const balloon = document.createElement("div");
      balloon.classList.add("image-balloon");
      balloon.innerHTML = `<img src="${imageSrc}" alt="${imageAlt}" />`;

      const rect = icon.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      balloon.style.top = `${rect.top + scrollTop - 200}px`;
      balloon.style.left = `${rect.left + scrollLeft - 200}px`;
      document.body.appendChild(balloon);

      // Fecha clicando fora
      document.addEventListener("click", function onClickOutside(ev) {
        if (!balloon.contains(ev.target) && ev.target !== icon) {
          balloon.remove();
          document.removeEventListener("click", onClickOutside);
        }
      });
    });
  });
}

window.addEventListener("resize", () => {
  closeAllImageBalloons();
});

/*******************************************************
 * 10) LÓGICA DE CARRINHO (com remover item + modal + brilho no botão)
 *******************************************************/
let cart = [];

/** Extrai o preço numérico do item */
function extractPriceNumber(item, selectedPrice) {
  if (selectedPrice === "grande" && typeof item.precoGrande === "number")
    return item.precoGrande;
  if (selectedPrice === "pequena" && typeof item.precoPequena === "number")
    return item.precoPequena;
  // Fallback
  return typeof item.preco === "number" ? item.preco : 0;
}

/** Adiciona (ou incrementa) o item no carrinho */
function addToCart(item, selectedPrice, button) {
  const nome = item.nome || t("produtoSemNome");
  const precoNum = extractPriceNumber(item, selectedPrice);

  // Cria uma chave única para o item com base no nome e preço
  const key = `${nome}_${precoNum}`;

  const existingIndex = cart.findIndex((prod) => prod.key === key);
  if (existingIndex >= 0) {
    cart[existingIndex].quantidade += 1;
  } else {
    cart.push({
      key: key, // chave única
      nome: nome,
      preco: precoNum,
      quantidade: 1,
    });
  }
  console.log("Carrinho Atual:", cart);

  // Atualiza a UI do carrinho
  updateCartUI();

  // === BRILHO NO BOTÃO ===
  if (button) {
    button.classList.add("btn-glow");
    setTimeout(() => {
      button.classList.remove("btn-glow");
    }, 800);
  }
}

/** Remove completamente o item do carrinho (independente da quantidade) */
function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

/** Atualiza o conteúdo do modal de carrinho */
function updateCartUI() {
  const cartContent = document.getElementById("cart-content");
  if (!cartContent) return;

  cartContent.innerHTML = "";

  if (cart.length === 0) {
    cartContent.innerHTML = `<p>${t('carrinhoVazio')}</p>`;
    return;
  }

  let total = 0; // Variável para acumular o total

  // Cria um container para os itens do carrinho
  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("cart-items");

  // Exibe cada item
  cart.forEach((item, idx) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    const subtotal = (item.preco * item.quantidade).toFixed(2);
    total += parseFloat(subtotal); // Adiciona ao total

    div.innerHTML = `
      <span class="item-details">
        <strong>${item.nome}</strong> (x${item.quantidade}) 
        - R$ ${item.preco.toFixed(2)} ${t('cada')} 
        <br /> ${t('subtotal')}: R$ ${subtotal}
      </span>
    `;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = t('remover');
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      removeItem(idx);
    });

    div.appendChild(removeBtn);
    itemsContainer.appendChild(div);
  });

  cartContent.appendChild(itemsContainer);

  // Cria um elemento para exibir o total
  const totalContainer = document.createElement("div");
  totalContainer.classList.add("cart-total");
  totalContainer.innerHTML = `
    <strong>${t('total')}: R$ ${total.toFixed(2)}</strong>
  `;
  cartContent.appendChild(totalContainer);
}

/** Constrói a mensagem de WhatsApp (itens do carrinho) */
function montarMensagemWhatsApp() {
  if (cart.length === 0) {
    return t('carrinhoVazio');
  }

  let mensagem = `${t('mensagemPedido')}\n\n`;
  let total = 0;

  cart.forEach((item) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    mensagem += `- ${item.nome} (x${item.quantidade}) = R$ ${subtotal.toFixed(2)}\n`;
  });

  mensagem += `\n${t('total')}: R$ ${total.toFixed(2)}`;
  return mensagem;
}

/** Abre o WhatsApp com o carrinho */
function sendOrder() {
  if (cart.length === 0) {
    alert(t('carrinhoVazio'));
    return;
  }

  // Pega o número do JSON (se existir)
  let numeroWhats = "5511999999999"; // fallback
  if (profileDataGlobal && profileDataGlobal.footer) {
    const footerData = profileDataGlobal.footer;
    if (footerData.contatoWhats) {
      numeroWhats = footerData.contatoWhats.replace(/\D/g, "");
      numeroWhats = "55" + numeroWhats;
    }
  }

  const mensagem = montarMensagemWhatsApp();
  const encodedMsg = encodeURIComponent(mensagem);

  const url = `https://wa.me/${numeroWhats}?text=${encodedMsg}`;
  window.open(url, "_blank");
}

/*******************************************************
 * 11) MODAL DO CARRINHO (Abrir, Fechar, Enviar Pedido)
 *******************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // Botão de abrir o carrinho
  const cartButton = document.getElementById("cart-button");
  // Modal e conteúdo
  const cartModal = document.getElementById("cart-modal");
  const closeCartBtn = document.getElementById("close-cart");
  const sendOrderBtn = document.getElementById("send-order");

  if (cartButton && cartModal) {
    cartButton.addEventListener("click", () => {
      // Atualiza a UI antes de mostrar
      updateCartUI();
      cartModal.style.display = "flex"; // exibe o modal
    });
  }

  // **Reativar os Event Listeners dos Botões**

  // Fechar o modal
  if (closeCartBtn && cartModal) {
    // Não atualizar o innerText aqui
    closeCartBtn.addEventListener("click", () => {
      cartModal.style.display = "none";
    });
  }

  // Enviar pedido (WhatsApp)
  if (sendOrderBtn) {
    // Não atualizar o innerText aqui
    sendOrderBtn.addEventListener("click", () => {
      sendOrder();
    });
  }

  // Clicar fora do conteúdo -> fecha modal
  if (cartModal) {
    window.addEventListener("click", (e) => {
      if (e.target === cartModal) {
        cartModal.style.display = "none";
      }
    });
  }

  // Modal de Seleção de Preço
  const priceModal = document.getElementById("price-modal");
  const closePriceModalBtn = document.getElementById("close-price-modal");
  const priceOptionsContainer = document.getElementById("price-options");

  // Fecha o modal de preço
  if (closePriceModalBtn && priceModal) {
    closePriceModalBtn.innerHTML = "&times;"; // Mantém o símbolo de fechar
    closePriceModalBtn.addEventListener("click", () => {
      priceModal.style.display = "none";
    });
  }

  // Fecha o modal de preço ao clicar fora
  if (priceModal) {
    window.addEventListener("click", (e) => {
      if (e.target === priceModal) {
        priceModal.style.display = "none";
      }
    });
  }
});

/*******************************************************
 * 12) Modal de Seleção de Preço
 *******************************************************/

/**
 * Abre o modal para seleção de preço e gerencia a escolha do usuário.
 * @param {Object} item - O item que está sendo adicionado ao carrinho.
 * @param {HTMLElement} button - O botão que foi clicado para adicionar ao carrinho.
 */
function openPriceModal(item, button) {
  const priceModal = document.getElementById("price-modal");
  const priceOptionsContainer = document.getElementById("price-options");

  if (!priceModal || !priceOptionsContainer) return;

  // Limpa as opções anteriores
  priceOptionsContainer.innerHTML = "";

  // Cria opções com base nos preços disponíveis
  if (item.precoGrande) {
    const btnGrande = document.createElement("button");
    btnGrande.classList.add("btn-price-option");
    btnGrande.innerText = `${t('grande')} - R$ ${item.precoGrande.toFixed(2)}`;
    btnGrande.addEventListener("click", () => {
      // Adiciona ao carrinho com preço grande
      addToCart(item, "grande", button);
      // Fecha o modal
      priceModal.style.display = "none";
    });
    priceOptionsContainer.appendChild(btnGrande);
  }

  if (item.precoPequena) {
    const btnPequena = document.createElement("button");
    btnPequena.classList.add("btn-price-option");
    btnPequena.innerText = `${t('pequena')} - R$ ${item.precoPequena.toFixed(2)}`;
    btnPequena.addEventListener("click", () => {
      // Adiciona ao carrinho com preço pequena
      addToCart(item, "pequena", button);
      // Fecha o modal
      priceModal.style.display = "none";
    });
    priceOptionsContainer.appendChild(btnPequena);
  }

  // Exibe o modal
  priceModal.style.display = "flex";
}

/*******************************************************
 * 13) Inicialização Geral (fetch JSON, etc.)
 *******************************************************/
(async () => {
  try {
    const data = await fetchProfileData();
    if (!data) {
      console.error("Não foi possível carregar dados de perfil.");
      return;
    }
    profileDataGlobal = data;

    // 1) Atualiza PERFIL
    updatePerfil(data.perfil);

    // 2) Categorias (cardápio)
    updateCategorias(data.categorias);

    // 3) Rodapé
    updateFooterLinks(data.footer);

    // 4) Balões de imagem (mobile)
    initializeImageBalloons();

    // 5) Atualiza textos dinâmicos nos botões e elementos que dependem do JSON após o carregamento
    atualizarTextosDinamicos();
  } catch (err) {
    console.error("Erro geral:", err);
  }
})();

/*******************************************************
 * 14) Atualizar Textos Estáticos
 *******************************************************/
function atualizarTextosDinamicos() {
  // Atualizar títulos, botões e outros elementos estáticos
  const observacoesTitulo = document.getElementById("observacoesIniciaisTitulo");
  if (observacoesTitulo) {
    observacoesTitulo.innerText = t("observacoesIniciaisTitulo");
  }

  const tituloCarrinho = document.getElementById("tituloCarrinho");
  if (tituloCarrinho) {
    tituloCarrinho.innerText = t("tituloCarrinho");
  }

  const escolhaTamanhoTitulo = document.getElementById("escolhaTamanhoTitulo");
  if (escolhaTamanhoTitulo) {
    escolhaTamanhoTitulo.innerText = t("escolhaTamanhoTitulo");
  }

  // Atualizar botões do modal do carrinho
  const closeCartBtn = document.getElementById("close-cart");
  if (closeCartBtn) {
    closeCartBtn.innerText = t('fechar');
  }

  const sendOrderBtn = document.getElementById("send-order");
  if (sendOrderBtn) {
    sendOrderBtn.innerText = t('enviarPedido');
  }

  // Atualizar outros textos estáticos conforme necessário
  // Exemplo:
  // const algumElemento = document.getElementById("algum-elemento");
  // if (algumElemento) {
  //   algumElemento.innerText = t("chaveCorrespondente");
  // }
}
