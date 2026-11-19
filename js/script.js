const screens = [...document.querySelectorAll(".screen")];

function showScreen(id) {
  screens.forEach(screen => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
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

document.getElementById("say-maybe").addEventListener("click", () => {
  const message = document.getElementById("maybe-message");
  message.textContent = "A maybe is okay too. Take your time — no pressure at all. ♡";
  message.classList.add("maybe-message");
});

document.getElementById("say-yes").addEventListener("click", () => {
  showScreen("invitation");
  launchConfetti();
});

function launchConfetti() {
  const holder = document.querySelector(".confetti");
  holder.innerHTML = "";
  const symbols = ["♥", "♡", "✦", "✿", "♥"];
  for (let i = 0; i < 32; i++) {
    const piece = document.createElement("i");
    piece.textContent = symbols[i % symbols.length];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 1.4}s`;
    piece.style.fontSize = `${12 + Math.random() * 15}px`;
    holder.appendChild(piece);
  }
}

// Replace this with your preferred contact method before publishing.
// Example: https://wa.me/91XXXXXXXXXX?text=It's%20a%20date!
const contactLink = "";
const messageLink = document.getElementById("message-link");
if (contactLink) {
  messageLink.href = contactLink;
} else {
  messageLink.href = "mailto:?subject=Our%20first%20date&body=It's%20a%20date!%20Let's%20pick%20a%20day%20and%20place.%20%E2%99%A5";
}
