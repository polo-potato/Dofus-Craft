// buySell.js

// Affiche le tableau du module "Calcul de ressources"
function renderBuySell() {
    const tbody = document.querySelector('#buySellTable tbody');
    tbody.innerHTML = "";
    let filtered = crafts.filter(craft => {
      return craft.name.includes(buySellFilterText);
    });
    if (buySellSort.column) {
      filtered.sort((a, b) => {
        let aVal = a[buySellSort.column].toLowerCase();
        let bVal = b[buySellSort.column].toLowerCase();
        if (aVal < bVal) return buySellSort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return buySellSort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    filtered.forEach(craft => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDisplayName(craft.name)}</td>
        <td>
          <button onclick="openBuySellModal('${craft.id}')">Calculer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    updateBuySellSortIndicators();
  }
  
  // Ouvre le modal "Calcul de ressources" pour le craft sélectionné
  function openBuySellModal(craftId) {
    currentBuySellCraft = crafts.find(c => c.id === craftId);
    if (!currentBuySellCraft) return;
    document.getElementById('buySellModalTitle').innerHTML = `Calcul de ressources - <span id="currentCraftName">${formatDisplayName(currentBuySellCraft.name)}</span>`;
    const bodyDiv = document.getElementById('buySellModalBody');
    bodyDiv.innerHTML = "";
    
    // Champ pour définir le nombre de crafts (valeur par défaut : 10)
    const craftsCountContainer = document.createElement('div');
    craftsCountContainer.style.marginBottom = "15px";
    craftsCountContainer.innerHTML = `
      <label>Nombre de crafts :</label>
      <input type="number" id="buySellCraftCount" value="10" min="1">
    `;
    bodyDiv.appendChild(craftsCountContainer);
    
    // Conteneur pour les inputs de ressources manquantes
    const rawReqContainer = document.createElement('div');
    rawReqContainer.id = "rawReqContainer";
    bodyDiv.appendChild(rawReqContainer);
    
    // Conteneur pour afficher le détail hiérarchisé de la production
    const breakdownContainer = document.createElement('div');
    breakdownContainer.id = "breakdownDetails";
    breakdownContainer.className = "breakdown";
    bodyDiv.appendChild(breakdownContainer);
    
    // Fonction pour mettre à jour dynamiquement les inputs et le détail
    function updateRawRequirements() {
      const count = parseInt(document.getElementById('buySellCraftCount').value) || 0;
      let invCopy = Object.assign({}, getInventoryObject());
      let result = produceWithDetails(currentBuySellCraft.name, count, invCopy);
      rawReqContainer.innerHTML = "";
      for (let raw in result.net) {
        let q = result.net[raw];
        let container = document.createElement('div');
        container.style.marginBottom = "10px";
        let html = `<strong>${formatDisplayName(raw)} (x${q})</strong><br>`;
        if (q < 10) {
          html += `<label style="font-weight: normal;">Prix par 1:</label>`;
          html += `<input type="number" id="buySellInput_${raw}_1" placeholder="Prix pour 1 unité" value="${(resourcePrices[raw] && resourcePrices[raw]['1']) ? resourcePrices[raw]['1'] : ''}" onchange="updateResourcePrice('${raw}', '1', this.value)"><br>`;
        } else if (q < 100) {
          html += `<label style="font-weight: normal;">Prix par 10:</label>`;
          html += `<input type="number" id="buySellInput_${raw}_10" placeholder="Prix pour 10 unités" value="${(resourcePrices[raw] && resourcePrices[raw]['10']) ? resourcePrices[raw]['10'] : ''}" onchange="updateResourcePrice('${raw}', '10', this.value)"><br>`;
        } else {
          let count100 = Math.floor(q / 100);
          let remainder = q % 100;
          html += `<label style="font-weight: normal;">Prix par 100:</label>`;
          html += `<input type="number" id="buySellInput_${raw}_100" placeholder="Prix pour 100 unités" value="${(resourcePrices[raw] && resourcePrices[raw]['100']) ? resourcePrices[raw]['100'] : ''}" onchange="updateResourcePrice('${raw}', '100', this.value)"><br>`;
          if (remainder >= 10) {
            html += `<label style="font-weight: normal;">Prix par 10:</label>`;
            html += `<input type="number" id="buySellInput_${raw}_10" placeholder="Prix pour 10 unités" value="${(resourcePrices[raw] && resourcePrices[raw]['10']) ? resourcePrices[raw]['10'] : ''}" onchange="updateResourcePrice('${raw}', '10', this.value)"><br>`;
          }
          if (remainder % 10 > 0) {
            html += `<label style="font-weight: normal;">Prix par 1:</label>`;
            html += `<input type="number" id="buySellInput_${raw}_1" placeholder="Prix pour 1 unité" value="${(resourcePrices[raw] && resourcePrices[raw]['1']) ? resourcePrices[raw]['1'] : ''}" onchange="updateResourcePrice('${raw}', '1', this.value)"><br>`;
          }
        }
        container.innerHTML = html;
        rawReqContainer.appendChild(container);
      }
      breakdownContainer.innerHTML = result.detailsHTML;
    }
    
    updateRawRequirements();
    const craftsCountInput = document.getElementById('buySellCraftCount');
    craftsCountInput.addEventListener('input', updateRawRequirements);
    
    document.getElementById('buySellResult').innerText = "";
    document.getElementById('buySellModal').style.display = "block";
  }
  
  // Exécute le calcul des coûts et met à jour le résultat affiché dans le modal
  function calculateBuySell() {
    if (!currentBuySellCraft) return;
    const craftsCount = parseInt(document.getElementById('buySellCraftCount').value) || 10;
    let invCopy = Object.assign({}, getInventoryObject());
    let result = produceWithDetails(currentBuySellCraft.name, craftsCount, invCopy);
    let totalCost = 0, valid = true;
    let resourceCosts = {};
    for (let raw in result.net) {
      let q = result.net[raw];
      let cost = 0;
      if (q < 10) {
        let input = document.getElementById(`buySellInput_${raw}_1`);
        if (!input) { valid = false; break; }
        let price1 = parseFloat(input.value);
        if (isNaN(price1)) { valid = false; break; }
        cost = price1 * q;
      } else if (q < 100) {
        let input = document.getElementById(`buySellInput_${raw}_10`);
        if (!input) { valid = false; break; }
        let price10 = parseFloat(input.value);
        if (isNaN(price10)) { valid = false; break; }
        cost = price10 * (q / 10);
      } else {
        let count100 = Math.floor(q / 100);
        let remainder = q % 100;
        let cost100 = 0, cost10 = 0, cost1 = 0;
        let input100 = document.getElementById(`buySellInput_${raw}_100`);
        if (!input100) { valid = false; break; }
        let price100 = parseFloat(input100.value);
        if (isNaN(price100)) { valid = false; break; }
        cost100 = price100 * count100;
        if (remainder >= 10) {
          let input10 = document.getElementById(`buySellInput_${raw}_10`);
          if (!input10) { valid = false; break; }
          let count10 = Math.floor(remainder / 10);
          let price10 = parseFloat(input10.value);
          if (isNaN(price10)) { valid = false; break; }
          cost10 = price10 * count10;
        }
        if (remainder % 10 > 0) {
          let input1 = document.getElementById(`buySellInput_${raw}_1`);
          if (!input1) { valid = false; break; }
          let price1 = parseFloat(input1.value);
          if (isNaN(price1)) { valid = false; break; }
          cost1 = price1 * (remainder % 10);
        }
        cost = cost100 + cost10 + cost1;
      }
      resourceCosts[raw] = cost;
      totalCost += cost;
    }
    if (!valid) {
      alert("Veuillez renseigner le prix d'achat pour chaque ressource.");
      return;
    }
    const resaleTotal = (currentBuySellCraft.resaleValue * craftsCount) / 10;
    const diff = resaleTotal - totalCost;
    
    let resultHTML = `<div class="result-container">
      <h3>Résultat</h3>
      <table class="result-table">
        <tr><th>Valeur de revente estimée</th><td>${resaleTotal.toFixed(2)} kamas</td></tr>
        <tr><th>Coût total des ressources</th><td>${totalCost.toFixed(2)} kamas</td></tr>
        <tr><th>Différence</th><td>${diff > 0 ? "Profit: " + diff.toFixed(2) + " kamas" : (diff < 0 ? "Perte: " + Math.abs(diff).toFixed(2) + " kamas" : "Équilibre")}</td></tr>
      </table>
      <h3>Détail des coûts</h3>
      <table class="breakdown-table">
        <thead>
          <tr>
            <th>Ressource</th>
            <th>Coût</th>
          </tr>
        </thead>
        <tbody>`;
    for (let raw in resourceCosts) {
      resultHTML += `<tr><td>${formatDisplayName(raw)}</td><td>${resourceCosts[raw].toFixed(2)} kamas</td></tr>`;
    }
    resultHTML += `</tbody></table></div>`;
    
    document.getElementById('buySellResult').innerHTML = resultHTML;
  }
  
  // Ferme le modal "Calcul de ressources"
  function closeBuySellModal() {
    document.getElementById('buySellModal').style.display = "none";
  }
  