/* ===========================================================
   Petruța – La mulți ani
   Gift interaction, audio unlock, and lightweight confetti.
   =========================================================== */

(() => {
  "use strict";

  const giftBox = document.getElementById("gift-box");
  const giftScreen = document.getElementById("gift-screen");
  const cardScreen = document.getElementById("card-screen");
  const music = document.getElementById("bg-music");
  const replayBtn = document.getElementById("replay-btn");
  const canvas = document.getElementById("confetti-canvas");

  let hasOpened = false;

  /* -----------------------------------------------------
     Gift box click → shake, confetti, music, reveal card
     ----------------------------------------------------- */

  function openGift() {
    if (hasOpened) return;
    hasOpened = true;

    // 1) Start the shake animation
    giftBox.classList.add("is-opening");

    // 2) Try to play music immediately, inside the click handler,
    //    so mobile browsers don't block autoplay.
    if (music) {
      music.currentTime = 0;
      music.play().catch(() => {
        // If playback fails (e.g. file missing), fail silently —
        // the rest of the experience still works.
      });
    }

    // 3) Fire confetti burst
    launchConfetti();

    // 4) After the shake, make the box vanish
    window.setTimeout(() => {
      giftBox.classList.remove("is-opening");
      giftBox.classList.add("is-vanishing");
    }, 500);

    // 5) Fade out the whole gift screen, then show the postcard
    window.setTimeout(() => {
      giftScreen.classList.add("is-leaving");
    }, 650);

    window.setTimeout(() => {
      giftScreen.hidden = true;
      cardScreen.hidden = false;
    }, 1150);
  }

  giftBox.addEventListener("click", openGift);

  /* -----------------------------------------------------
     Replay button: reset to screen 1 so the moment
     can be experienced again without reloading.
     ----------------------------------------------------- */

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      hasOpened = false;

      cardScreen.hidden = true;
      giftScreen.hidden = false;
      giftScreen.classList.remove("is-leaving");
      giftBox.classList.remove("is-vanishing", "is-opening");

      if (music) {
        music.pause();
        music.currentTime = 0;
      }
    });
  }

  /* -----------------------------------------------------
     Lightweight confetti burst (no external libraries)
     ----------------------------------------------------- */

  function launchConfetti() {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const colors = ["#ff8fb8", "#ffd1e3", "#f4709c", "#f6c453", "#ffffff"];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.35;
    const particleCount = 70;

    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.5 ? "rect" : "circle",
        life: 1,
      };
    });

    const gravity = 0.16;
    const drag = 0.99;
    let frame = 0;
    const maxFrames = 110;
    let rafId;

    function tick() {
      frame++;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p) => {
        p.vx *= drag;
        p.vy *= drag;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.life = Math.max(0, 1 - frame / maxFrames);

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      if (frame < maxFrames) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        window.cancelAnimationFrame(rafId);
      }
    }

    window.requestAnimationFrame(tick);
  }

  window.addEventListener("resize", () => {
    if (!canvas) return;
    canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
  });
})();
