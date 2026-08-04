/* MoneySave Landing — vanilla JS เท่านั้น ไม่มี dependency */
"use strict";

(function () {
  // เปิดทางให้ CSS รู้ว่ามี JS — หน้าเว็บต้องยังเห็นได้ถ้า JS ไม่ทำงาน
  document.documentElement.classList.add("js");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- เมนูมือถือ ---------- */
  function initNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "ปิดเมนู" : "เปิดเมนู");
      menu.hidden = !open;
    };

    toggle.addEventListener("click", () => {
      setOpen(menu.hidden);
    });

    // กด Escape หรือคลิกนอกเมนู = ปิด
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) {
        setOpen(false);
      }
    });

    // คลิกลิงก์ในเมนู = ปิดเมนู
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- ticker ตัวเลขใน mockup ---------- */
  function initTicker() {
    const els = document.querySelectorAll("[data-count]");
    if (!els.length) return;

    const fmt = (n) =>
      n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const animate = (el) => {
      // ค่ารับคอมม่าได้ (กันคนคัดข้อความบนหน้าจอมาวาง) และกันค่าเสียไม่ให้แสดง NaN
      const raw = String(el.dataset.count).replace(/,/g, "");
      const end = parseFloat(raw);
      if (Number.isNaN(end)) return;
      if (prefersReduced) {
        el.textContent = fmt(end);
        return;
      }
      const start = performance.now();
      const duration = 1400;
      const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = fmt(end * ease(t));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    els.forEach(animate);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initTicker();
  });
})();
