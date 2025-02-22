// crafts.js

// Ouvre le modal pour ajouter un craft
function openCraftModal() {
    document.getElementById('craftModalTitle').innerText = "Ajouter un Craft";
    document.getElementById('craftId').value = "";
    document.getElementById('craftName').value = "";
    document.getElementById('craftIngredients').value = "";
    document.getElementById('craftResale').value = "";
    document.getElementById('craftModal').style.display = "block";
  }
  
  // Ferme le modal des crafts
  function closeCraftModal() {
    document.getElementById('craftModal').style.display = "none";
  }
  
  // Sauvegarde (ajoute ou modifie) un craft
  function saveCraft() {
    let id = document.getElementById('craftId').value;
    let name = document.getElementById('craftName').value.trim().toLowerCase();
    let ingredientsText = document.getElementById('craftIngredients').value.trim().toLowerCase();
    let resaleValue = parseFloat(document.getElementById('craftResale').value);
    if (name === "" || ingredientsText === "" || isNaN(resaleValue)) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }
    if (id) {
      const index = crafts.findIndex(c => c.id === id);
      if (index !== -1) {
        crafts[index] = { id, name, ingredients: ingredientsText, resaleValue };
      }
    } else {
      let newCraft = { id: Date.now().toString(), name, ingredients: ingredientsText, resaleValue };
      crafts.push(newCraft);
    }
    saveData();
    renderCrafts();
    renderBuySell();
    calculateProfitability();
    closeCraftModal();
  }
  
  // Permet de charger un craft dans le modal pour modification
  function editCraft(id) {
    const craft = crafts.find(c => c.id === id);
    if (craft) {
      document.getElementById('craftModalTitle').innerText = "Modifier un Craft";
      document.getElementById('craftId').value = craft.id;
      document.getElementById('craftName').value = craft.name;
      document.getElementById('craftIngredients').value = craft.ingredients;
      document.getElementById('craftResale').value = craft.resaleValue;
      document.getElementById('craftModal').style.display = "block";
    }
  }
  
  // Supprime un craft après confirmation
  function deleteCraft(id) {
    if (confirm("Voulez-vous vraiment supprimer ce craft ?")) {
      crafts = crafts.filter(c => c.id !== id);
      saveData();
      renderCrafts();
      renderBuySell();
      calculateProfitability();
    }
  }
  
  // Affiche la liste des crafts dans le tableau
    function renderCrafts() {
      console.log("renderCrafts() called");
      const tbody = document.querySelector('#craftTable tbody');
      tbody.innerHTML = "";
      let filtered = crafts.filter(craft => {
        return craft.name.includes(craftFilterText) ||
              craft.ingredients.includes(craftFilterText) ||
              String(craft.resaleValue).includes(craftFilterText);
      });
    console.log("Crafts filtrés :", filtered);
    if (craftSort.column) {
      filtered.sort((a, b) => {
        let aVal = a[craftSort.column];
        let bVal = b[craftSort.column];
        if (craftSort.column === "resaleValue") {
          return craftSort.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
          if (aVal < bVal) return craftSort.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return craftSort.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    }
    filtered.forEach(craft => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDisplayName(craft.name)}</td>
        <td>${craft.ingredients}</td>
        <td><input type="number" class="inline-input" value="${craft.resaleValue}" onchange="updateCraftValue('${craft.id}', this.value)"></td>
        <td>
          <button onclick="editCraft('${craft.id}')">Modifier</button>
          <button onclick="deleteCraft('${craft.id}')">Supprimer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    updateCraftSortIndicators();
  }
  
  
  // Permet de mettre à jour la valeur de revente d'un craft directement dans le tableau
function updateCraftValue(craftId, newValue) {
  let craft = crafts.find(c => c.id === craftId);
  if (craft) {
    craft.resaleValue = parseFloat(newValue) || 0;
    saveData();
    renderCrafts();
    renderBuySell();
    calculateProfitability();
  }
}