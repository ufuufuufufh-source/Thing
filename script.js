 // ===== VARIABLES DE JEU =====
let score = 0;
let monkeys = 0;
let monkeyCost = 50;

let planters = 0;
let planterCost = 100;
let clickBonus = 1;

let magicBananas = 0;
let magicCost = 500;
let magicMultiplier = 1;

// ===== SONS =====
const achievementSound = new Audio("achievement.mp3");

// ===== ACHIEVEMENTS =====
const achievements = [
  { id: "firstClick", condition: () => score >= 1, text: "🍌 Première banane !" },
  { id: "hundredBananas", condition: () => score >= 100, text: "💯 100 bananes !" },
  { id: "firstMonkey", condition: () => monkeys >= 1, text: "🐵 Premier singe acheté !" },
  { id: "fiveMonkeys", condition: () => monkeys >= 5, text: "🦍 5 singes !" },
  { id: "firstPlanter", condition: () => planters >= 1, text: "🌱 Premier planteur acheté !" },
  { id: "fivePlanters", condition: () => planters >= 5, text: "🌿 5 planteurs !" },
  { id: "firstMagic", condition: () => magicBananas >= 1, text: "✨ Premier bananier magique !" }
];

let unlockedAchievements = new Set();

// ===== FONCTIONS ACHIEVEMENTS =====
function checkAchievements() {
  achievements.forEach(a => {
    if (!unlockedAchievements.has(a.id) && a.condition()) {
      unlockedAchievements.add(a.id);
      unlockAchievement(a.text);
    }
  });
}

function unlockAchievement(text) {
  const list = document.getElementById("achievementsList");
  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);

  achievementSound.currentTime = 0;
  achievementSound.play().catch(() => console.log("Impossible de jouer le son de l’achievement."));
}

// ===== FONCTIONS PRINCIPALES =====
function increment() {
  score += clickBonus;
  updateUI();

  const clickSoundInstance = new Audio("click.mp3");
  clickSoundInstance.play().catch(() => console.log("Impossible de jouer le son du click."));
}

function buyMonkey() {
  if (score >= monkeyCost) {
    score -= monkeyCost;
    monkeys++;
    monkeyCost = Math.floor(monkeyCost * 1.5);
    updateUI();
  }
}

function buyPlanter() {
  if (score >= planterCost) {
    score -= planterCost;
    planters++;
    clickBonus++;
    planterCost = Math.floor(planterCost * 1.8);
    updateUI();
  }
}

function buyMagic() {
  if (score >= magicCost) {
    score -= magicCost;
    magicBananas++;
    magicMultiplier *= 2;
    magicCost = Math.floor(magicCost * 2);
    updateUI();
  }
}

function updateUI() {
  document.getElementById("score").textContent = `Bananas : ${score}`;
  document.getElementById("monkeys").textContent = monkeys;
  document.getElementById("monkeyCost").textContent = monkeyCost;
  document.getElementById("planters").textContent = planters;
  document.getElementById("planterCost").textContent = planterCost;
  document.getElementById("magicBananas").textContent = magicBananas;
  document.getElementById("magicCost").textContent = magicCost;

  checkAchievements();
}

// ===== PRODUCTION AUTOMATIQUE =====
setInterval(() => {
  score += monkeys * magicMultiplier;
  updateUI();
}, 1000);

// ===== BOUTON SECRET =====
function loseBanas() {
  score -= 1000000000;
  updateUI();
  alert("💀 Oups, tu as perdu 1 000 000 000 de bananes !");
}

// ===== PUB VIDEO BLOQUANTE =====
function showAd() {
  const overlay = document.getElementById("blockOverlay");
  const popup = document.getElementById("popup");
  const popupVideo = document.getElementById("popupVideo");

  overlay.style.display = "block";
  overlay.style.pointerEvents = "auto";
  popupVideo.style.display = "block";
  popup.classList.add("show");

  document.body.style.pointerEvents = "none";
  overlay.style.pointerEvents = "auto";

  clearInterval(randomPopupInterval);

  popupVideo.src = "pub.mp4";
  popupVideo.muted = true; // permet de bypass le blocage autoplay
  popupVideo.play()
    .then(() => popupVideo.muted = false)
    .catch(err => console.log("Impossible de lire la vidéo :", err));

  popupVideo.onended = () => {
    popup.classList.remove("show");
    overlay.style.display = "none";
    popupVideo.style.display = "none";
    document.body.style.pointerEvents = "auto";
    randomPopupInterval = setInterval(showRandomPopup, 50000);
  };
}

function triggerAd() {
  score += 10000;
  updateUI();
  showAd();
}

// ===== PUBS PNG ALÉATOIRES =====
function showRandomPopup() {
  const popupVideo = document.getElementById("popupVideo");
  if (!popupVideo.paused) return;

  const overlay = document.getElementById("blockOverlay");
  const popup = document.getElementById("popup");
  const popupImg = document.getElementById("popupImage");

  overlay.style.display = "block";
  overlay.style.pointerEvents = "auto";
  popupImg.style.display = "block";
  popup.classList.add("show");

  const popupImages = [
    "banana1.png", "banana2.png",
    "monkey1.png", "monkey2.png",
    "banana-fun.png", "dancing-monkey.png",
    "golden-banana.png"
  ];
  popupImg.src = popupImages[Math.floor(Math.random() * popupImages.length)];

  setTimeout(() => {
    popup.classList.remove("show");
    overlay.style.display = "none";
  }, 4000);
}

let randomPopupInterval = setInterval(showRandomPopup, 50000);

// ===== GARFIELD =====
let garfieldTimeout;

function showGarfield() {
  const overlay = document.getElementById("blockOverlay");
  const popup = document.getElementById("popup");
  const popupImg = document.getElementById("popupImage");
  const popupVideo = document.getElementById("popupVideo");

  if ((overlay && overlay.style.display === "block") || (popupVideo && !popupVideo.paused)) {
    console.log("Garfield bloqué car pub en cours.");
    return;
  }

  if (garfieldTimeout) {
    clearTimeout(garfieldTimeout);
    garfieldTimeout = null;
  }

  score -= 1000;
  updateUI();

  overlay.style.display = "block";
  overlay.style.pointerEvents = "auto";
  popupImg.src = "garfield.png";
  popupImg.style.display = "block";
  popup.classList.add("show");

  // Crée un message dans la popup
  let popupMessage = document.getElementById("popupMessage");
  if (!popupMessage) {
    popupMessage = document.createElement("div");
    popupMessage.id = "popupMessage";
    popupMessage.style.position = "absolute";
    popupMessage.style.bottom = "12px";
    popupMessage.style.left = "50%";
    popupMessage.style.transform = "translateX(-50%)";
    popupMessage.style.padding = "6px 10px";
    popupMessage.style.background = "rgba(0,0,0,0.6)";
    popupMessage.style.color = "white";
    popupMessage.style.borderRadius = "6px";
    popup.appendChild(popupMessage);
  }
  popupMessage.textContent = "😼 Garfield est venu et a mangé 1000 bananes !";
  popupMessage.style.display = "block";

  garfieldTimeout = setTimeout(() => {
    popup.classList.remove("show");
    overlay.style.display = "none";
    popupImg.style.display = "none";
    popupMessage.style.display = "none";
    garfieldTimeout = null;
  }, 3000);
}

setInterval(showGarfield, 120000);

// Sauvegarder
function saveGame() {
  const saveData = {
    score,
    monkeys,
    planters,
    magicBananas,
    monkeyCost,
    planterCost,
    magicCost,
    clickBonus,
    magicMultiplier
  };
  localStorage.setItem("bananaGameSave", JSON.stringify(saveData));
}

// Charger
function loadGame() {
  const saved = localStorage.getItem("bananaGameSave");
  if (saved) {
    const data = JSON.parse(saved);
    score = data.score;
    monkeys = data.monkeys;
    planters = data.planters;
    magicBananas = data.magicBananas;
    monkeyCost = data.monkeyCost;
    planterCost = data.planterCost;
    magicCost = data.magicCost;
    clickBonus = data.clickBonus;
    magicMultiplier = data.magicMultiplier;
    updateUI();
  }
}

// Exemple : sauvegarde automatique toutes les 10 secondes
setInterval(saveGame, 10000);

// Charger au démarrage
window.addEventListener("load", loadGame);
