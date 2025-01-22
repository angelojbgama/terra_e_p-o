/*******************************************************
 * 1) Mapeamento de Ícones -> Font Awesome
 *******************************************************/
const IconMapping = {
  // ... [Seu mapeamento existente]
  default: "fas fa-question",
};

/*******************************************************
 * 2) Variáveis para Gerenciar Filtros
 *******************************************************/
let activeFilters = {
  vegan: false,
  alcoolico: false,
};

/*******************************************************
 * 3) Detectar idioma e carregar JSON do perfil
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
 * 4) Helper Function para acessar textos do JSON
 *******************************************************/
function t(key) {
  return (
    profileDataGlobal &&
    profileDataGlobal.texts &&
    profileDataGlobal.texts[key]
      ? profileDataGlobal.texts[key]
      : key
  );
}

/*******************************************************
 * 5) Atualizar elementos de PERFIL
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
 * 6) Atualizar Categorias com Filtros
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
      // Aplicar filtros
      if (activeFilters.vegan && !item.vegan) return null;
      if (activeFilters.alcoolico && !item.alcoolico) return null;

      const li = document.createElement("li");
      li.style.position = "relative"; // Garantir que o posicionamento absoluto funcione

      // Ícone de Ação (Balão de Imagem)
      const iconClass = "fa-solid fa-image menu-item-icon";
      const iconElem = document.createElement("i");
      iconElem.className = iconClass;
      iconElem.setAttribute("aria-hidden", "true");
      iconElem.setAttribute("aria-label", "Ver imagem"); // Acessibilidade
      li.appendChild(iconElem);

      // Imagem
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.nome;
      img.classList.add("menu-item-image");
      img.loading = "lazy"; // Adiciona lazy loading para performance
      li.appendChild(img);

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
        const br = document.createElement("br");
        li.appendChild(br);
        const em = document.createElement("em");
        em.innerText = item.descricao;
        li.appendChild(em);
      }

      // Indicadores de Veganismo e Alcoólico (se aplicável)
      if (item.vegan) {
        const veganIcon = document.createElement("i");
        veganIcon.className = "fa-solid fa-seedling categorization-icon vegan-icon";
        veganIcon.setAttribute("aria-hidden", "true");
        veganIcon.setAttribute("aria-label", "Vegan");
        li.appendChild(veganIcon);
      }

      if (item.alcoolico) {
        const alcoolIcon = document.createElement("i");
        alcoolIcon.className = "fa-solid fa-beer-mug-empty categorization-icon alcool-icon";
        alcoolIcon.setAttribute("aria-hidden", "true");
        alcoolIcon.setAttribute("aria-label", "Alcoólico");
        li.appendChild(alcoolIcon);
      }

      // Botão Adicionar ao Carrinho
      const addBtn = document.createElement("button");
      addBtn.classList.add("btn-add-cart");
      addBtn.innerHTML = `${t('adicionarAoCarrinho')} <i class="fas fa-cart-plus"></i>`;

      // Verifica se o item tem múltiplos preços
      const hasMultiplePrices =
        (typeof item.precoGrande === "number" && typeof item.precoPequena === "number") ||
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
          if (li) ulSub.appendChild(li);
        });
        contentDiv.appendChild(ulSub);
      });
    }

    // Itens diretos (sem subcategorias)
    if (Array.isArray(categoria.itens)) {
      const ul = document.createElement("ul");
      categoria.itens.forEach((item) => {
        const li = criarItemCardapio(item);
        if (li) ul.appendChild(li);
      });
      contentDiv.appendChild(ul);
    }

    // Se não houver itens após aplicar filtros, não exibe a categoria
    if (contentDiv.querySelectorAll("li").length === 0) {
      return;
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
 * 7) Função para obter string de preço
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
 * 8) Rodapé (WhatsApp, Instagram)
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
 * 9) Tema Claro/Escuro
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

  // Inicializar Filtros após o DOM estar pronto
  initializeFilterButtons();
});

/*******************************************************
 * 10) Balão de Imagem (Mobile)
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
      balloon.style.left = `${rect.left + scrollLeft + 10}px`;
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
 * 11) LÓGICA DE CARRINHO (com remover item + modal + brilho no botão)
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

  // Verifica se a opção de endereço está marcada
  const deliveryCheckbox = document.getElementById("delivery-address-checkbox");
  let endereco = "";
  if (deliveryCheckbox && deliveryCheckbox.checked) {
    const deliveryInput = document.getElementById("delivery-address-input");
    if (deliveryInput && deliveryInput.value.trim() !== "") {
      endereco = `\nEndereço de Entrega: ${deliveryInput.value.trim()}`;
    } else {
      alert("Por favor, insira o endereço de entrega ou desmarque a opção.");
      return;
    }
  }

  const mensagemFinal = `${mensagem}${endereco}`;
  const encodedMsg = encodeURIComponent(mensagemFinal);

  const url = `https://wa.me/${numeroWhats}?text=${encodedMsg}`;
  window.open(url, "_blank");
}

/*******************************************************
 * 12) MODAL DO CARRINHO (Abrir, Fechar, Enviar Pedido)
 *******************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cart-button");
  const floatingCartButton = document.getElementById("floating-cart-button");
  const cartModal = document.getElementById("cart-modal");
  const closeCartButton = document.getElementById("close-cart");
  const sendOrderButton = document.getElementById("send-order");

  // Elementos da nova seção de endereço
  const deliveryCheckbox = document.getElementById("delivery-address-checkbox");
  const deliveryInput = document.getElementById("delivery-address-input");

  // Função para abrir o modal do carrinho
  const openCartModal = () => {
    cartModal.style.display = "flex";
  };

  // Função para fechar o modal do carrinho
  const closeCartModal = () => {
    cartModal.style.display = "none";
  };

  // Adicionar event listeners aos botões de carrinho
  if (cartButton) {
    cartButton.addEventListener("click", openCartModal);
  }
  if (floatingCartButton) {
    floatingCartButton.addEventListener("click", openCartModal);
  }

  // Event listener para fechar o modal
  if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCartModal);
  }

  // Event listener para enviar o pedido
  if (sendOrderButton) {
    sendOrderButton.addEventListener("click", () => {
      sendOrder();
      closeCartModal();
    });
  }

  // Fechar o modal ao clicar fora do conteúdo
  window.addEventListener("click", (event) => {
    if (event.target === cartModal) {
      closeCartModal();
    }
  });

  // Lógica para mostrar/ocultar a caixa de endereço
  if (deliveryCheckbox && deliveryInput) {
    deliveryCheckbox.addEventListener("change", () => {
      if (deliveryCheckbox.checked) {
        deliveryInput.style.display = "block";
      } else {
        deliveryInput.style.display = "none";
      }
    });
  }
});

/*******************************************************
 * 13) Modal de Seleção de Preço
 *******************************************************/

/**
 * Abre o modal para seleção de preço e gerencia a escolha do usuário.
 * @param {Object} item - O item que está sendo adicionado ao carrinho.
 * @param {HTMLElement} button - O botão que foi clicado para adicionar ao carrinho.
 */
function openPriceModal(item, button) {
  const priceModal = document.getElementById("price-modal");
  const priceOptionsContainer = document.getElementById("price-options");
  const closePriceModalBtn = document.getElementById("close-price-modal");
  const priceModalTitle = document.getElementById("price-modal-title");

  if (!priceModal || !priceOptionsContainer) return;

  // Limpa as opções anteriores
  priceOptionsContainer.innerHTML = "";

  // Atualiza o título do modal
  priceModalTitle.innerText = t("escolhaTamanhoTitulo") || "Escolha o Tamanho";

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

  // Adicionar event listener para fechar o modal ao clicar no 'X'
  if (closePriceModalBtn) {
    closePriceModalBtn.addEventListener(
      "click",
      () => {
        priceModal.style.display = "none";
      },
      { once: true } // Use { once: true } para garantir que o listener seja removido após o primeiro clique
    );
  }

  // Adicionar event listener para fechar o modal ao clicar fora do conteúdo
  const onClickOutside = (event) => {
    if (event.target === priceModal) {
      priceModal.style.display = "none";
      priceModal.removeEventListener("click", onClickOutside);
    }
  };

  priceModal.addEventListener("click", onClickOutside);
}

/*******************************************************
 * 14) Inicialização Geral (fetch JSON, etc.)
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

    // 2) Categorias (cardápio) com filtros aplicados
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
 * 15) Atualizar Textos Estáticos
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

  const closeCartBtn = document.getElementById("close-cart");
  if (closeCartBtn) {
    closeCartBtn.innerText = t('fechar');
  }

  const sendOrderBtn = document.getElementById("send-order");
  if (sendOrderBtn) {
    sendOrderBtn.innerText = t('enviarPedido');
  }

  // Atualizar títulos e botões do modal de seleção de preço
  const priceModalTitle = document.getElementById("price-modal-title");
  if (priceModalTitle) {
    priceModalTitle.innerText = t("escolhaTamanhoTitulo") || "Escolha o Tamanho";
  }

  // Atualizar textos para a nova seção de endereço de entrega
  const deliveryLabel = document.querySelector(".delivery-address-section label");
  if (deliveryLabel) {
    const checkbox = deliveryLabel.querySelector("#delivery-address-checkbox");
    if (checkbox) {
      // Não substitua o innerHTML para preservar o checkbox e o event listener
      const labelText = t("Enviar para meu endereço");
      // Limpa o texto existente (preservando o checkbox)
      deliveryLabel.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          deliveryLabel.removeChild(node);
        }
      });
      // Adiciona o novo texto
      deliveryLabel.appendChild(document.createTextNode(` ${labelText}`));
    }
  }

  const deliveryInput = document.getElementById("delivery-address-input");
  if (deliveryInput) {
    deliveryInput.placeholder = t("Digite o endereço para entrega");
  }
}

/*******************************************************
 * 16) Inicializar Botões de Filtro
 *******************************************************/
function initializeFilterButtons() {
  const filterVeganBtn = document.getElementById("filter-vegan");
  const filterAlcoolicoBtn = document.getElementById("filter-alcoolico");
  const filterResetBtn = document.getElementById("filter-reset");

  if (filterVeganBtn) {
    filterVeganBtn.addEventListener("click", () => {
      if (!activeFilters.vegan) {
        // Ativa o filtro 'vegan' e desativa 'alcoolico'
        activeFilters = { vegan: true, alcoolico: false };
      } else {
        // Se já estiver ativo, desativa todos os filtros
        activeFilters = { vegan: false, alcoolico: false };
      }
      updateFilterButtonStates(); // Atualiza a aparência dos botões
      updateCardapioWithFilters(); // Atualiza o cardápio com os filtros aplicados
      localStorage.setItem("activeFilters", JSON.stringify(activeFilters)); // Salva o estado dos filtros
    });
  }

  if (filterAlcoolicoBtn) {
    filterAlcoolicoBtn.addEventListener("click", () => {
      if (!activeFilters.alcoolico) {
        // Ativa o filtro 'alcoolico' e desativa 'vegan'
        activeFilters = { vegan: false, alcoolico: true };
      } else {
        // Se já estiver ativo, desativa todos os filtros
        activeFilters = { vegan: false, alcoolico: false };
      }
      updateFilterButtonStates(); // Atualiza a aparência dos botões
      updateCardapioWithFilters(); // Atualiza o cardápio com os filtros aplicados
      localStorage.setItem("activeFilters", JSON.stringify(activeFilters)); // Salva o estado dos filtros
    });
  }

  if (filterResetBtn) {
    filterResetBtn.addEventListener("click", () => {
      // Desativa todos os filtros
      activeFilters = { vegan: false, alcoolico: false };
      // Remove a classe 'active' de todos os botões de filtro
      document.querySelectorAll(".filter-button").forEach((btn) => btn.classList.remove("active"));
      updateFilterButtonStates(); // Atualiza a aparência dos botões
      updateCardapioWithFilters(); // Atualiza o cardápio sem filtros
      localStorage.setItem("activeFilters", JSON.stringify(activeFilters)); // Salva o estado dos filtros
    });
  }

  // Restaurar estado salvo dos filtros ao carregar a página
  const savedFilters = JSON.parse(localStorage.getItem("activeFilters"));
  if (savedFilters) {
    activeFilters = savedFilters;
    updateFilterButtonStates(); // Atualiza a aparência dos botões com base no estado salvo
  }
}

/** 
 * Atualiza a aparência dos botões de filtro com base nos filtros ativos 
 */
function updateFilterButtonStates() {
  const filterVeganBtn = document.getElementById("filter-vegan");
  const filterAlcoolicoBtn = document.getElementById("filter-alcoolico");

  if (activeFilters.vegan && filterVeganBtn) {
    filterVeganBtn.classList.add("active");
  } else if (filterVeganBtn) {
    filterVeganBtn.classList.remove("active");
  }

  if (activeFilters.alcoolico && filterAlcoolicoBtn) {
    filterAlcoolicoBtn.classList.add("active");
  } else if (filterAlcoolicoBtn) {
    filterAlcoolicoBtn.classList.remove("active");
  }
}

/*******************************************************
 * 17) Atualizar Cardápio com Filtros
 *******************************************************/
function updateCardapioWithFilters() {
  // Re-fetch o perfilDataGlobal para obter as categorias
  if (profileDataGlobal && profileDataGlobal.categorias) {
    updateCategorias(profileDataGlobal.categorias);
    initializeImageBalloons(); // Re-inicializar os balões após atualizar as categorias
  }
}
