// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  },
  { passive: true },
);

// ── Hamburger menu ────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

function openMenu() {
  hamburger.classList.add("open");
  navLinks.classList.add("open");
  hamburger.setAttribute("aria-expanded", "true");
  hamburger.setAttribute("aria-label", "Fechar menu de navegação");
}

function closeMenu() {
  hamburger.classList.remove("open");
  navLinks.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Abrir menu de navegação");
}

hamburger.addEventListener("click", () => {
  if (hamburger.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Fecha com Escape e devolve foco ao botão
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && hamburger.classList.contains("open")) {
    closeMenu();
    hamburger.focus();
  }
});

// Fecha ao clicar em qualquer link do menu
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// ── Intersection Observer (reveal animations) ─────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Anima barras de progresso dentro do elemento revelado
        entry.target.querySelectorAll(".progress-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });

        // Anima contadores dentro do elemento revelado
        entry.target.querySelectorAll("[data-target]").forEach((el) => {
          animateCounter(el);
        });

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

document
  .querySelectorAll(".reveal, .reveal-left, .reveal-right")
  .forEach((el) => {
    revealObserver.observe(el);
  });

// Observa as stats do hero separadamente
const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        document
          .querySelectorAll("[data-target]")
          .forEach((el) => animateCounter(el));
        statsObserver.disconnect();
      }
    },
    { threshold: 0.5 },
  );
  statsObserver.observe(heroStats);
}

// ── Counter animation ─────────────────────────────────────
function animateCounter(el) {
  // Respeita prefers-reduced-motion — exibe valor final imediatamente
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || (el.dataset.target >= 100 ? "+" : "");
    el.textContent = target + suffix;
    return;
  }

  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || (el.dataset.target >= 100 ? "+" : "");
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ── Contact form ──────────────────────────────────────────
const form = document.getElementById("contactForm");
const toast = document.getElementById("toast");

function setFieldError(input, errorId, message) {
  const errorEl = document.getElementById(errorId);
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorEl.textContent = message;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    // Limpa após a transição para não reanunciar ao leitor de tela
    setTimeout(() => {
      toast.textContent = "";
    }, 350);
  }, 5000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nomeInput = form.nome;
  const emailInput = form.email;
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  let valid = true;

  if (!nome) {
    setFieldError(nomeInput, "nome-error", "Por favor, informe seu nome.");
    valid = false;
  } else {
    setFieldError(nomeInput, "nome-error", "");
  }

  if (!email || !emailInput.validity.valid) {
    setFieldError(
      emailInput,
      "email-error",
      "Por favor, informe um e-mail válido.",
    );
    valid = false;
  } else {
    setFieldError(emailInput, "email-error", "");
  }

  if (!valid) return;

  const btn = form.querySelector(".form-submit");
  btn.textContent = "⏳ Enviando...";
  btn.disabled = true;

  // Substituir pelo fetch/API real em produção
  setTimeout(() => {
    btn.innerHTML = '<span aria-hidden="true">☀</span> Enviar Mensagem';
    btn.disabled = false;
    showToast("✅ Mensagem enviada! Entraremos em contato em breve.");
    form.reset();
    [nomeInput, emailInput].forEach((el) =>
      el.setAttribute("aria-invalid", "false"),
    );
  }, 1200);
});

// ── Active link highlight on scroll ──────────────────────
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a:not(.nav-cta)");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          a.style.color =
            a.getAttribute("href") === "#" + entry.target.id
              ? "var(--gold-light)"
              : "";
        });
      }
    });
  },
  { threshold: 0.4 },
);

sections.forEach((s) => sectionObserver.observe(s));
