// sorting.js

// Fonction de bascule du tri pour le module Crafts
function toggleCraftSort(column) {
    if (craftSort.column === column) {
      craftSort.direction = craftSort.direction === "asc" ? "desc" : "asc";
    } else {
      craftSort.column = column;
      craftSort.direction = "asc";
    }
    renderCrafts();
  }
  
  // Fonction de bascule du tri pour le module Ingrédients
  function toggleIngredientSort(column) {
    if (ingredientSort.column === column) {
      ingredientSort.direction = ingredientSort.direction === "asc" ? "desc" : "asc";
    } else {
      ingredientSort.column = column;
      ingredientSort.direction = "asc";
    }
    renderIngredients();
  }
  
  // Fonction de bascule du tri pour le module Rentabilité (profit)
  function toggleProfitSort(column) {
    if (profitSort.column === column) {
      profitSort.direction = profitSort.direction === "asc" ? "desc" : "asc";
    } else {
      profitSort.column = column;
      profitSort.direction = "asc";
    }
    calculateProfitability();
  }
  
  // Fonction de bascule du tri pour le module Calcul de ressources
  function toggleBuySellSort(column) {
    if (buySellSort.column === column) {
      buySellSort.direction = buySellSort.direction === "asc" ? "desc" : "asc";
    } else {
      buySellSort.column = column;
      buySellSort.direction = "asc";
    }
    renderBuySell();
  }
  
  // Mise à jour des indicateurs de tri pour le module Crafts
  function updateCraftSortIndicators() {
    const cols = ["name", "ingredients", "resaleValue"];
    cols.forEach(col => {
      const span = document.getElementById("craft-sort-" + col);
      if (craftSort.column === col) {
        span.textContent = craftSort.direction === "asc" ? "▲" : "▼";
        span.classList.add("active");
      } else {
        span.textContent = "";
        span.classList.remove("active");
      }
    });
  }
  
  // Mise à jour des indicateurs de tri pour le module Ingrédients
  function updateIngredientSortIndicators() {
    const cols = ["name", "quantity"];
    cols.forEach(col => {
      const span = document.getElementById("ingredient-sort-" + col);
      if (ingredientSort.column === col) {
        span.textContent = ingredientSort.direction === "asc" ? "▲" : "▼";
        span.classList.add("active");
      } else {
        span.textContent = "";
        span.classList.remove("active");
      }
    });
  }
  
  // Mise à jour des indicateurs de tri pour le module Rentabilité
  function updateProfitSortIndicators() {
    const cols = ["craft", "possibleCount", "profit"];
    cols.forEach(col => {
      const span = document.getElementById("profit-sort-" + col);
      if (profitSort.column === col) {
        span.textContent = profitSort.direction === "asc" ? "▲" : "▼";
        span.classList.add("active");
      } else {
        span.textContent = "";
        span.classList.remove("active");
      }
    });
  }
  
  // Mise à jour des indicateurs de tri pour le module Calcul de ressources
  function updateBuySellSortIndicators() {
    const span = document.getElementById("buySell-sort-name");
    if (buySellSort.column === "name") {
      span.textContent = buySellSort.direction === "asc" ? "▲" : "▼";
      span.classList.add("active");
    } else {
      span.textContent = "";
      span.classList.remove("active");
    }
  }
  