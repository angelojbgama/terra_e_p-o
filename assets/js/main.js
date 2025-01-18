// --- Mapeamento de Habilidades para Classes do Font Awesome ---
// Exemplo de mapeamento geral de ícones
const IconMapping = {
  // -- Ícones de Comida --
  pizza: "fas fa-pizza-slice",
  burger: "fas fa-burger",       // Requer FA 6+
  hotdog: "fas fa-hotdog",       // Requer FA 6+
  fries: "fas fa-french-fries",  // Requer FA 6+ (nome exato: fa-french-fries)
  sushi: "fas fa-sushi",         // Requer FA 6+ (nome exato: fa-sushi ou fa-nigiri)
  fish: "fas fa-fish",
  bacon: "fas fa-bacon",
  egg: "fas fa-egg",             // Requer FA 6+
  cheese: "fas fa-cheese",
  bread: "fas fa-bread-slice",
  croissant: "fas fa-croissant", // Requer FA 6+
  carrot: "fas fa-carrot",
  apple: "fas fa-apple-whole",   // Em versões mais novas do FA 6, é "fa-apple-whole"
  lemon: "fas fa-lemon",
  pepperHot: "fas fa-pepper-hot",
  seedling: "fas fa-seedling",   // Plantinha
  drumstick: "fas fa-drumstick-bite",
  shrimp: "fas fa-shrimp",       // Requer FA 6+

  // -- Ícones de Bebidas --
  coffee: "fas fa-mug-saucer",           // Substituto de fa-coffee (FA 6)
  tea: "fas fa-mug-hot",                 // FA 5/6
  soda: "fas fa-cup-straw",              // Requer FA 6+ (nome exato: fa-cup-straw)
  beer: "fas fa-beer-mug-empty",         // Nome antigo: fa-beer; no FA 6: "fa-beer-mug-empty"
  wine: "fas fa-wine-bottle",
  cocktail: "fas fa-martini-glass-citrus", // FA 6 substituiu fa-cocktail

  // -- Ícones de Doces / Sobremesas --
  cupcake: "fas fa-cupcake",   // Requer FA 6+ (nome exato: fa-cupcake)
  iceCream: "fas fa-ice-cream",
  cake: "fas fa-cake-candles", // Em FA 6 “fa-cake-candles”

  // -- Ícones Gerais (UI, Web, etc.) --
  home: "fas fa-house",               // (FA 6) Substitui fa-home
  user: "fas fa-user",
  envelope: "fas fa-envelope",
  phone: "fas fa-phone",
  mapMarker: "fas fa-map-marker-alt",
  shoppingCart: "fas fa-shopping-cart",
  check: "fas fa-check",
  times: "fas fa-xmark",             // Em FA 6 foi substituído por fa-xmark
  plus: "fas fa-plus",
  minus: "fas fa-minus",
  arrowRight: "fas fa-arrow-right",
  arrowLeft: "fas fa-arrow-left",
  gear: "fas fa-gear",               // FA 6 substituiu fa-cog
  search: "fas fa-magnifying-glass", // FA 6 substituiu fa-search
  trash: "fas fa-trash",
  edit: "fas fa-pen-to-square",      // FA 6 substituiu fa-edit
  save: "fas fa-floppy-disk",        // FA 6 substituiu fa-save
  folder: "fas fa-folder",
  file: "fas fa-file",
  download: "fas fa-download",
  upload: "fas fa-upload",
  
  // -- Ícones de Redes Sociais (caso precise) --
  github: "fab fa-github",
  linkedin: "fab fa-linkedin",
  instagram: "fab fa-instagram",
  facebook: "fab fa-facebook",
  twitter: "fab fa-twitter",

  // -- Exemplo de “fallback” genérico --
  default: "fas fa-question", // Caso precise usar em chaves desconhecidas
};

// --- Função para Detectar o Idioma do Navegador e Carregar o JSON Correspondente ---
async function fetchProfileData() {
  // Detecta o idioma do navegador
  let language = navigator.language || navigator.userLanguage;
  language = language.substring(0, 2).toLowerCase(); // Extrai o código do idioma (ex: 'pt', 'en', 'es')

  // Lista de idiomas suportados
  const supportedLanguages = ["pt", "en", "es"];

  // Verifica se o idioma detectado é suportado; caso contrário, define como padrão ('pt')
  if (!supportedLanguages.includes(language)) {
    language = "pt";
  }

  // Define o caminho do arquivo JSON baseado no idioma
  const url = `data/profile_${language}.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao carregar o arquivo JSON: ${response.statusText}`);
    }

    const profileData = await response.json();
    return profileData;
  } catch (error) {
    console.error(error);
    // Opcional: Retornar dados padrão ou exibir uma mensagem de erro para o usuário
    return null;
  }
}

// --- Funções para Atualizar Diferentes Partes do Perfil ---

// 1. Atualizar Informações do Perfil
function updateProfileInfo(profileData) {
  // Atualizar Foto de Perfil
  const photo = document.getElementById("profile.photo");
  if (photo) {
    photo.src = profileData.photo;
    photo.alt = profileData.name;
  }

  // Atualizar Nome
  const name = document.getElementById("profile.name");
  if (name) {
    name.innerText = profileData.name;
  }

  // Atualizar Job
  const jobContainer = document.getElementById("profile.job");
  if (jobContainer) {
    const jobText = jobContainer.querySelector(".info-text");
    if (jobText) {
      jobText.innerText = profileData.job;
    }
  }

  // Atualizar Graduação
  const graduateContainer = document.getElementById("profile.graduate");
  if (graduateContainer) {
    const graduateText = graduateContainer.querySelector(".info-text");
    if (graduateText) {
      graduateText.innerText = profileData.graduate;
    }
  }

  // Atualizar a Barra de Progresso da Graduação
  const graduetescaleContainer = document.getElementById("profile.graduetescale");
  if (graduetescaleContainer && profileData.graduetescale) {
    const progress = graduetescaleContainer.querySelector(".progress");
    const progressText = graduetescaleContainer.querySelector(".progress-text");
    if (progress && progressText) {
      const completed = profileData.graduetescale.completed;
      const total = profileData.graduetescale.total;
      const percentage = Math.min((completed / total) * 100, 100).toFixed(2); // Limita a 100% e formata para 2 casas decimais
      progress.style.width = `${percentage}%`;
      progressText.innerText = `${completed} disciplinas cursadas de ${total} (${percentage}%)`;
    }
  }

  // Atualizar Localização
  const locationContainer = document.getElementById("profile.location");
  if (locationContainer) {
    const locationText = locationContainer.querySelector(".info-text");
    if (locationText) {
      locationText.innerText = profileData.location;
    }
  }

  // Atualizar Telefone
  const phone = document.getElementById("profile.phone");
  if (phone) {
    phone.innerText = profileData.phone;
    // Remova caracteres não numéricos para a URL do WhatsApp
    const phoneNumber = profileData.phone.replace(/\D/g, "");
    phone.href = `https://wa.me/55${phoneNumber}`;
  }

  // Atualizar Email
  const email = document.getElementById("profile.email");
  if (email) {
    email.innerText = profileData.email;
    email.href = `mailto:${profileData.email}`;
  }

  // Atualizar o Título do Documento
  if (profileData.title) {
    document.title = profileData.title;
  }
}

// 2. Atualizar Habilidades Técnicas (Hard Skills)
function updateHardSkills(profileData) {
  const hardSkills = document.getElementById("profile.skills.hardSkills");
  if (hardSkills) {
    hardSkills.innerHTML = profileData.skills.hardSkills
      .map(
        (skill) => `
          <li>
              <i class="${
                skill.iconClass ||
                IconMapping[skill.name] ||
                "fas fa-tools"
              }" aria-hidden="true"></i>
              <span class="skill-name">${skill.name}</span>
          </li>
      `
      )
      .join("");
  }

  // Adicionar Event Listeners para Interatividade
  document.querySelectorAll(".hard-skills li").forEach((item) => {
    item.addEventListener("click", () => {
      // Remove a classe 'active' de todos os itens
      document.querySelectorAll(".hard-skills li").forEach((el) => el.classList.remove("active"));

      // Adiciona a classe 'active' ao item clicado
      item.classList.add("active");

      // Define um tempo para esconder o balão automaticamente
      setTimeout(() => {
        item.classList.remove("active");
      }, 2000); // 2 segundos
    });
  });

  // Adiciona um evento global para detectar cliques fora dos itens
  document.addEventListener("click", (event) => {
    // Verifica se o clique não foi em um item da lista
    if (!event.target.closest(".hard-skills li")) {
      document.querySelectorAll(".hard-skills li").forEach((el) => el.classList.remove("active"));
    }
  });
}

// 3. Atualizar Habilidades Comportamentais (Soft Skills)
function updateSoftSkills(profileData) {
  const softSkills = document.getElementById("profile.skills.softSkills");
  if (softSkills) {
    softSkills.innerHTML = profileData.skills.softSkills
      .map((skill) => `<li>${skill}</li>`)
      .join("");
  }
}

// 4. Atualizar Idiomas
function updateLanguages(profileData) {
  const languages = document.getElementById("profile.languages");
  if (languages) {
    languages.innerHTML = profileData.languages
      .map(
        (language) => `
          <li>
              <i class="fas fa-language" aria-hidden="true"></i>
              <span class="info-text">${language}</span>
          </li>
      `
      )
      .join("");
  }
}

// 5. Atualizar Portfólio
function updatePortfolio(profileData) {
  const portfolio = document.getElementById("profile.portfolio");
  if (portfolio) {
    portfolio.innerHTML = profileData.portfolio
      .map((project) => {
        // Escolhe o ícone com base na existência do link do GitHub
        const iconClass = project.github ? 'fab fa-github' : 'fas fa-link';
        // Se houver um link do GitHub, adiciona um ícone adicional para o GitHub
        const githubLink = project.github
          ? `<a href="${project.github}" target="_blank" aria-label="GitHub">
               <i class="fab fa-github"></i>
             </a>`
          : '';
        return `
          <li>
            <h3>
              <i class="${iconClass}"></i> ${project.name}
            </h3>
            <a href="${project.url}" target="_blank">${project.url}</a>
          </li>
        `;
      })
      .join("");
  }
}

// 6. Atualizar Experiência Profissional
function updateProfessionalExperience(profileData) {
  const professionalExperience = document.getElementById("profile.professionalExperience");
  if (professionalExperience) {
    professionalExperience.innerHTML = profileData.professionalExperience
      .map(
        (experience) => `
          <li>
              <h3 class="title">${experience.name}</h3>
              <p class="period">${experience.period}</p>
              <p>${experience.description}</p>
          </li>
      `
      )
      .join("");
  }
}

// 7. Atualizar Títulos dos Accordions
function updateAccordionTitles(profileData) {
  const accordionTitlesMapping = {
    titleSkills: "acordeon.titleSkills",
    titleLanguages: "acordeon.titleLanguages",
    titlePortfolio: "acordeon.titlePortfolio",
    titleProfessionalExperience: "acordeon.titleProfessionalExperience",
  };

  for (const [jsonKey, elementId] of Object.entries(accordionTitlesMapping)) {
    const titleElement = document.getElementById(elementId);
    if (titleElement && profileData[jsonKey]) {
      titleElement.innerText = profileData[jsonKey];
    }
  }
}

// 8. Atualizar Títulos das Seções Internas das Habilidades
function updateSkillTitles(profileData) {
  const skillTitlesMapping = {
    titleHardSkills: "skills.titleHardSkills",
    titleSoftSkills: "skills.titleSoftSkills",
  };

  for (const [jsonKey, elementId] of Object.entries(skillTitlesMapping)) {
    const titleElement = document.getElementById(elementId);
    if (titleElement && profileData.skills[jsonKey]) {
      titleElement.innerText = profileData.skills[jsonKey];
    }
  }
}

// --- Função Principal para Carregar e Atualizar o Perfil ---
(async () => {
  try {
    const profileData = await fetchProfileData();
    if (profileData) {
      updateProfileInfo(profileData);
      updateSoftSkills(profileData);
      updateHardSkills(profileData);
      updateLanguages(profileData);
      updatePortfolio(profileData);
      updateProfessionalExperience(profileData);
      updateAccordionTitles(profileData); // Atualizar títulos dos accordions
      updateSkillTitles(profileData); // Atualizar títulos das seções internas das habilidades
    } else {
      console.error("Dados do perfil não foram carregados.");
    }
  } catch (error) {
    console.error("Erro ao atualizar o perfil:", error);
  }
})();

// --- Funções para Alternar Tema (Claro/Escuro) ---
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return; // Verifica se o elemento existe

  const toggleIcon = themeToggle.querySelector("i"); // Seleciona o ícone dentro do botão
  const currentTheme = localStorage.getItem("theme") || "dark";

  // Função para atualizar o ícone com base no tema
  const updateIcon = (theme) => {
    // Remove ambas as classes de toggle
    toggleIcon.classList.remove("fa-toggle-off", "fa-toggle-on");

    if (theme === "light") {
      toggleIcon.classList.add("fa-toggle-on");
    } else {
      toggleIcon.classList.add("fa-toggle-off");
    }
  };

  // Aplicar o tema salvo anteriormente e atualizar o ícone
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.add("dark-theme");
  }
  updateIcon(currentTheme);

  // Adicionar evento de clique para alternar o tema
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");

    const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
    updateIcon(theme);
    localStorage.setItem("theme", theme);
  });
});

// --- Funções para Favoritar Página ---
const favoriteToggle = document.getElementById("favorite-toggle");
if (favoriteToggle) { // Verifica se o elemento existe
  const favoriteIcon = favoriteToggle.querySelector("i"); // Ícone de favorito
  const isFavorited = localStorage.getItem("isFavorited") === "true";

  // Função para atualizar o ícone de favorito
  const updateFavoriteIcon = (favorited) => {
    if (favorited) {
      favoriteIcon.classList.remove("fa-regular", "fa-star");
      favoriteIcon.classList.add("fa-solid", "fa-star");
    } else {
      favoriteIcon.classList.remove("fa-solid", "fa-star");
      favoriteIcon.classList.add("fa-regular", "fa-star");
    }
  };

  // Aplicar o estado de favorito salvo anteriormente e atualizar o ícone
  updateFavoriteIcon(isFavorited);

  // Evento de clique para alternar o favorito
  favoriteToggle.addEventListener("click", () => {
    const favorited = localStorage.getItem("isFavorited") === "true";
    const newFavoriteStatus = !favorited;
    updateFavoriteIcon(newFavoriteStatus);
    localStorage.setItem("isFavorited", newFavoriteStatus);
  });
}
