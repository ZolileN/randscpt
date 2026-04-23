document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.getElementById("navbar");
  const themeToggle = document.getElementById("themeToggle");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const reelTrack = document.getElementById("reelTrack");
  const reelPrev = document.getElementById("reelPrev");
  const reelNext = document.getElementById("reelNext");
  const currentYear = document.getElementById("currentYear");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sections = document.querySelectorAll(".fade-up");
  const parallaxTarget = document.querySelector("[data-parallax]");
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  const countdownNodes = {
    label: document.getElementById("nextEventLabel"),
    title: document.getElementById("nextEventTitle"),
    meta: document.getElementById("nextEventMeta"),
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  const events = [
    {
      label: "Sunday Session",
      title: "Sunday Session Luxury Braai",
      meta: "Sunday, 26 April at 15:00",
      date: "2026-04-26T15:00:00+02:00"
    },
    {
      label: "Sunset Warmup",
      title: "Friday Red Room Warmup",
      meta: "Friday, 1 May at 18:00",
      date: "2026-05-01T18:00:00+02:00"
    },
    {
      label: "Main Floor",
      title: "Saturday Night Experience",
      meta: "Saturday, 2 May at 20:00",
      date: "2026-05-02T20:00:00+02:00"
    }
  ];

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  const smoothScrollTo = (targetY) => {
    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 900;
    let startTime = null;

    const animate = (time) => {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };

    window.requestAnimationFrame(animate);
  };

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const navOffset = navbar ? navbar.offsetHeight + 24 : 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navOffset;
      smoothScrollTo(targetY);

      if (navMenu?.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        hamburger?.setAttribute("aria-expanded", "false");
      }
    });
  });

  const handleScrollState = () => {
    if (navbar) {
      navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    if (parallaxTarget && !prefersReducedMotion) {
      const offset = Math.min(window.scrollY * 0.08, 36);
      parallaxTarget.style.transform = `translateY(${offset}px) scale(${1 + Math.min(window.scrollY / 5000, 0.06)})`;
    }
  };

  window.addEventListener("scroll", handleScrollState, { passive: true });
  handleScrollState();

  if (themeToggle) {
    const savedTheme = localStorage.getItem("rands-theme");
    if (savedTheme === "night") {
      body.classList.add("theme-night");
    }

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("theme-night");
      localStorage.setItem("rands-theme", body.classList.contains("theme-night") ? "night" : "day");
    });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -30px 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    sections.forEach((section) => section.classList.add("is-visible"));
  }

  const formatUnit = (value) => String(Math.max(0, value)).padStart(2, "0");

  const getNextEvent = () => {
    const now = new Date();
    return events.find((event) => new Date(event.date) > now) || events[0];
  };

  const updateCountdown = () => {
    const event = getNextEvent();
    const now = new Date().getTime();
    const eventTime = new Date(event.date).getTime();
    const diff = Math.max(0, eventTime - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownNodes.label.textContent = event.label;
    countdownNodes.title.textContent = event.title;
    countdownNodes.meta.textContent = event.meta;
    countdownNodes.days.textContent = formatUnit(days);
    countdownNodes.hours.textContent = formatUnit(hours);
    countdownNodes.minutes.textContent = formatUnit(minutes);
    countdownNodes.seconds.textContent = formatUnit(seconds);
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const reelStep = () => {
    if (!reelTrack) return 0;
    const firstCard = reelTrack.querySelector(".reel-card");
    if (!firstCard) return 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    return cardWidth + 18;
  };

  if (reelPrev && reelTrack) {
    reelPrev.addEventListener("click", () => {
      reelTrack.scrollBy({ left: -reelStep(), behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  if (reelNext && reelTrack) {
    reelNext.addEventListener("click", () => {
      reelTrack.scrollBy({ left: reelStep(), behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }
});
