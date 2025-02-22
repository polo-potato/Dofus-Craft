// =========================
// Variables Globales
// =========================
let craftFilterText = "";
let ingredientFilterText = "";
let profitFilterText = "";
let buySellFilterText = "";
let craftSort = { column: "", direction: "asc" };
let ingredientSort = { column: "", direction: "asc" };
let profitSort = { column: "", direction: "asc" };
let buySellSort = { column: "", direction: "asc" };
let resourcePrices = {};

let crafts = [];
let ingredients = [];
let currentBuySellCraft = null;

// =========================
// Gestion du Thème
// =========================
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    document.querySelectorAll('.module-button').forEach(btn => {
      btn.classList.add('dark-theme');
      btn.classList.remove('light-theme');
    });
    document.getElementById('themeToggle').classList.add('dark-theme');
    document.getElementById('themeToggle').classList.remove('light-theme');
    document.getElementById('themeToggle').innerText = "Clair";
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    document.querySelectorAll('.module-button').forEach(btn => {
      btn.classList.add('light-theme');
      btn.classList.remove('dark-theme');
    });
    document.getElementById('themeToggle').classList.add('light-theme');
    document.getElementById('themeToggle').classList.remove('dark-theme');
    document.getElementById('themeToggle').innerText = "Sombre";
  }
}

function toggleTheme() {
  let currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
}

// =========================
// Configuration Initiale & Écouteurs Globaux
// =========================
window.addEventListener('load', () => {

    console.log("Page loaded, calling loadData()");
    loadData();

    
    // Appliquer le thème sauvegardé
    console.log("apply theme");
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    
    console.log("calling renderCrafts()");
    renderCrafts();
    console.log("calling renderIngredients()");
    renderIngredients();
    console.log("calling renderBuySell()");
    renderBuySell();
    console.log("calling calculateProfitability()");
    calculateProfitability();


  
    // Ajout des écouteurs de filtre pour actualiser les tableaux lors de la saisie
    document.getElementById('craftFilterInput').addEventListener('input', function() {
        craftFilterText = this.value.toLowerCase();
        renderCrafts();
    });
    document.getElementById('ingredientFilterInput').addEventListener('input', function() {
        ingredientFilterText = this.value.toLowerCase();
        renderIngredients();
    });
    document.getElementById('profitFilterInput').addEventListener('input', function() {
        profitFilterText = this.value.toLowerCase();
        calculateProfitability();
    });
    document.getElementById('buySellFilterInput').addEventListener('input', function() {
        buySellFilterText = this.value.toLowerCase();
        renderBuySell();
    });
});

function formatDisplayName(name) {
    const exceptions = ["de", "du", "la", "le", "les", "des", "au", "aux", "et", "à", "en"];
    let words = name.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (i === 0 || !exceptions.includes(words[i])) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
    }
    return words.join(" ");
  }
  
