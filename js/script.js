/* ================= ✏️ EDIT THESE ================= */
const CONFIG = {
  // Her name (leave "" to keep "you")
  herName: "Teju",
  // The date in YYYY-MM-DD, used for the countdown and calendar button (leave "" to hide both)
  dateISO: "2026-11-21",
  // Shown on the invitation card, e.g. "Saturday, 6 December"
  dateText: "Saturday, 21 November",
  yesMessage: "Yes! I'd love to go on that first date with you 💖🥰 See you at 10!",
  maybeMessage: "Hmm… maybe? 🙈 Let me think about it a little ♡"
};
/* ================================================= */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const screens = [...document.querySelectorAll(".screen")];

function whatsappLink(text) {
  // No number in the link: WhatsApp opens with the message ready and she picks your chat
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

document.getElementById("date-text").textContent = CONFIG.dateText;

/* ---------- Her name ---------- */
if (CONFIG.herName.trim()) {
  const name = CONFIG.herName.trim();
  document.getElementById("greet-kicker").textContent = `Pssst... ${name}!`;
  document.getElementById("dear-line").textContent = `Dear ${name},`;
}

/* ---------- Countdown + calendar (need CONFIG.dateISO) ---------- */
const dateStart = /^\d{4}-\d{2}-\d{2}$/.test(CONFIG.dateISO)
  ? new Date(`${CONFIG.dateISO}T10:00:00+05:30`) // 10 AM IST
  : null;

if (dateStart) {
  // Google Calendar link, 10 AM to 4 PM IST
  const d = CONFIG.dateISO.replaceAll("-", "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Our first date 💖",
    dates: `${d}T100000/${d}T160000`,
    ctz: "Asia/Kolkata",
    details: "Pickup from your place at 10 AM 🚗\n🛕 Temple visit\n🎬 Movie\n🍽️ Lunch\n✨ And then… wherever the day takes us"
  });
  const cal = document.getElementById("calendar-link");
  cal.href = `https://calendar.google.com/calendar/render?${params}`;
  cal.hidden = false;

  const countdown = document.getElementById("countdown");
  countdown.hidden = false;
  const tick = () => {
    const ms = dateStart - Date.now();
    if (ms <= 0) { countdown.textContent = "Today's the day! 💖"; return; }
    const mins = Math.floor(ms / 60000);
    const days = Math.floor(mins / 1440);
    const hours = Math.floor((mins % 1440) / 60);
    const m = mins % 60;
    const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
    countdown.textContent = days > 0
      ? `Our date is in ${plural(days, "day")}, ${plural(hours, "hour")} ♡`
      : `Our date is in ${plural(hours, "hour")}, ${plural(m, "minute")} ♡`;
  };
  tick();
  setInterval(tick, 30000);
}
document.getElementById("message-link").href = whatsappLink(CONFIG.yesMessage);
document.getElementById("maybe-whatsapp").href = whatsappLink(CONFIG.maybeMessage);

function showScreen(id) {
  screens.forEach(screen => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
  resetMaybePosition();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("open-surprise").addEventListener("click", () => {
  document.getElementById("envelope").classList.add("open");
  window.setTimeout(() => showScreen("note"), 450);
});

document.getElementById("ask-question").addEventListener("click", () => showScreen("question"));

document.querySelectorAll(".back-button").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.back));
});

/* ---------- Background hearts ---------- */

(function startFloaters() {
  if (reducedMotion.matches) return;
  const holder = document.querySelector(".floaters");
  const symbols = ["♡", "♥", "✿", "✧"];
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("span");
    s.textContent = symbols[i % symbols.length];
    s.style.left = `${Math.random() * 100}%`;
    s.style.fontSize = `${12 + Math.random() * 14}px`;
    s.style.animationDuration = `${14 + Math.random() * 10}s`;
    s.style.animationDelay = `${-Math.random() * 20}s`;
    holder.appendChild(s);
  }
})();

/* ---------- Emoji rain (used for both Yes and Maybe) ---------- */

function rain(holder, symbols, count, extraClass = "") {
  if (reducedMotion.matches) return;
  holder.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    piece.textContent = symbols[i % symbols.length];
    if (extraClass) piece.className = extraClass;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 1.4}s`;
    piece.style.fontSize = `${14 + Math.random() * 16}px`;
    holder.appendChild(piece);
  }
}

/* ---------- The playful "Maybe" button ---------- */

const questionScreen = document.getElementById("question");
const yesButton = document.getElementById("say-yes");
const maybeButton = document.getElementById("say-maybe");
const maybeMessage = document.getElementById("maybe-message");
const maybePanel = document.getElementById("maybe-panel");
const moodFace = document.getElementById("mood-face");

const MAX_DODGES = { mouse: 3, touch: 2 };
const dodges = { mouse: 0, touch: 0 };
const teases = ["Hehe, almost! 🙈", "Too slow! Try again 😜", "Okay okay, one more try… 😏"];
let offset = { x: 0, y: 0 };
let lastPointer = "mouse";

function canDodge(kind) {
  return !reducedMotion.matches && dodges[kind] < MAX_DODGES[kind];
}

function overlaps(a, b, gap = 10) {
  return a.left < b.right + gap && a.right > b.left - gap &&
         a.top < b.bottom + gap && a.bottom > b.top - gap;
}

function dodgeMaybe(kind) {
  const pad = 12;
  const btn = maybeButton.getBoundingClientRect();
  const area = questionScreen.getBoundingClientRect();
  const yes = yesButton.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;

  const homeLeft = btn.left - offset.x;
  const homeTop = btn.top - offset.y;

  // Stay inside the question screen AND the visible window
  const minX = Math.max(area.left, 0) + pad;
  const maxX = Math.min(area.right, vw) - pad - btn.width;
  const minY = Math.max(area.top, 0) + pad;
  const maxY = Math.min(area.bottom, vh) - pad - btn.height;

  let best = null;
  for (let i = 0; i < 20; i++) {
    const x = maxX > minX ? minX + Math.random() * (maxX - minX) : homeLeft;
    const y = maxY > minY ? minY + Math.random() * (maxY - minY) : homeTop;
    const spot = { left: x, top: y, right: x + btn.width, bottom: y + btn.height };
    const farEnough = Math.hypot(x - btn.left, y - btn.top) > btn.height * 1.5;
    if (!overlaps(spot, yes) && farEnough) { best = { x, y }; break; }
  }
  if (!best) return;

  offset = { x: best.x - homeLeft, y: best.y - homeTop };
  maybeButton.style.setProperty("--dx", `${offset.x}px`);
  maybeButton.style.setProperty("--dy", `${offset.y}px`);
  maybeButton.classList.add("maybe-dodging");
  maybeMessage.textContent = teases[Math.min(dodges[kind], teases.length - 1)];
  dodges[kind]++;
}

function resetMaybePosition() {
  offset = { x: 0, y: 0 };
  maybeButton.style.setProperty("--dx", "0px");
  maybeButton.style.setProperty("--dy", "0px");
  maybeButton.classList.remove("maybe-dodging");
}

maybeButton.addEventListener("pointerenter", event => {
  if (event.pointerType === "touch") return;
  if (canDodge("mouse")) dodgeMaybe("mouse");
});

maybeButton.addEventListener("pointerdown", event => {
  lastPointer = event.pointerType;
});

maybeButton.addEventListener("click", event => {
  const fromTouch = event.detail > 0 && lastPointer === "touch";
  if (fromTouch && canDodge("touch")) {
    dodgeMaybe("touch");
    return;
  }
  chooseMaybe();
});

function chooseMaybe() {
  resetMaybePosition();
  maybeMessage.textContent = "";
  // The grumpy reaction stays on screen
  moodFace.textContent = "😤";
  moodFace.classList.remove("grumpy");
  void moodFace.offsetWidth; // restart the shake if Maybe is picked again
  moodFace.classList.add("grumpy");
  maybePanel.hidden = false;
  rain(document.getElementById("question-rain"), ["😤", "😒", "🙄", "🥺", "😾"], 18, "grumpy-drop");
}

let lastWidth = window.innerWidth;
window.addEventListener("resize", () => {
  if (window.innerWidth !== lastWidth) {
    lastWidth = window.innerWidth;
    resetMaybePosition();
  }
});

/* ---------- Yes! ---------- */

yesButton.addEventListener("click", () => {
  showScreen("invitation");
  rain(document.querySelector(".invitation-screen .confetti"),
       ["💖", "😍", "🥰", "💕", "♥", "😘", "✨"], 36);
});
