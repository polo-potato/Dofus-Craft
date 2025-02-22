// ingredients.js

// Ouvre le modal pour ajouter un ingrédient
function openIngredientModal() {
    document.getElementById('ingredientModalTitle').innerText = "Ajouter un ingrédient";
    document.getElementById('ingredientId').value = "";
    document.getElementById('ingredientName').value = "";
    document.getElementById('ingredientQuantity').value = "";
    document.getElementById('ingredientModal').style.display = "block";
  }
  
  // Ferme le modal des ingrédients
  function closeIngredientModal() {
    document.getElementById('ingredientModal').style.display = "none";
  }
  
  // Sauvegarde (ajoute ou modifie) un ingrédient
  function saveIngredient() {
    let id = document.getElementById('ingredientId').value;
    let name = document.getElementById('ingredientName').value.trim().toLowerCase();
    let quantity = parseFloat(document.getElementById('ingredientQuantity').value);
    if (name === "" || isNaN(quantity)) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }
    if (id) {
      const index = ingredients.findIndex(i => i.id === id);
      if (index !== -1) {
        ingredients[index] = { id, name, quantity };
      }
    } else {
      let newIngredient = { id: Date.now().toString(), name, quantity };
      ingredients.push(newIngredient);
    }
    saveData();
    renderIngredients();
    closeIngredientModal();
  }
  
  // Charge un ingrédient dans le modal pour modification
  function editIngredient(id) {
    const ing = ingredients.find(i => i.id === id);
    if (ing) {
      document.getElementById('ingredientModalTitle').innerText = "Modifier un ingrédient";
      document.getElementById('ingredientId').value = ing.id;
      document.getElementById('ingredientName').value = ing.name;
      document.getElementById('ingredientQuantity').value = ing.quantity;
      document.getElementById('ingredientModal').style.display = "block";
    }
  }
  
  // Supprime un ingrédient après confirmation
  function deleteIngredient(id) {
    if (confirm("Voulez-vous vraiment supprimer cet ingrédient ?")) {
      ingredients = ingredients.filter(i => i.id !== id);
      saveData();
      renderIngredients();
    }
  }
  
  // Affiche la liste des ingrédients dans le tableau
  function renderIngredients() {
    const tbody = document.querySelector('#ingredientTable tbody');
    tbody.innerHTML = "";
    let filtered = ingredients.filter(ing => {
      return ing.name.includes(ingredientFilterText) ||
             String(ing.quantity).includes(ingredientFilterText);
    });
    if (ingredientSort.column) {
      filtered.sort((a, b) => {
        let aVal = a[ingredientSort.column];
        let bVal = b[ingredientSort.column];
        if (ingredientSort.column === "quantity") {
          return ingredientSort.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
          if (aVal < bVal) return ingredientSort.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return ingredientSort.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    }
    filtered.forEach(ing => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDisplayName(ing.name)}</td>
        <td><input type="number" class="inline-input" value="${ing.quantity}" onchange="updateIngredientQuantity('${ing.id}', this.value)"></td>
        <td>
          <button onclick="editIngredient('${ing.id}')">Modifier</button>
          <button onclick="deleteIngredient('${ing.id}')">Supprimer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    updateIngredientSortIndicators();
  }
  

  function updateIngredientQuantity(ingId, newQuantity) {
    let ing = ingredients.find(i => i.id === ingId);
    if (ing) {
      ing.quantity = parseFloat(newQuantity) || 0;
      saveData();
      renderIngredients();
      renderBuySell();
      calculateProfitability();
    }
  }