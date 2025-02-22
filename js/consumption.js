// consumption.js

// Ouvre le modal "Détails de consommation" pour le craft dont l'ID est passé en paramètre.
// Cette fonction récupère le craft, calcule le nombre maximum de productions possibles,
// génère le détail hiérarchisé via la fonction produceWithDetails (définie dans production.js)
// et affiche le tout dans le modal.
function openConsumptionDetailModal(craftId) {
    const craft = crafts.find(c => c.id === craftId);
    if (!craft) return;
    let maxCount = maxProduction(craft.name);
    let invCopy = Object.assign({}, getInventoryObject());
    let result = produceWithDetails(craft.name, maxCount, invCopy);
    document.getElementById('consumptionModalBody').innerHTML = result.detailsHTML;
    document.getElementById('consumptionModalTitle').innerText = "Détails de consommation - " + formatDisplayName(craft.name) + " (" + maxCount + " crafts)";
    document.getElementById('consumptionModal').style.display = "block";
  }
  
  // Ferme le modal "Détails de consommation"
  function closeConsumptionModal() {
    document.getElementById('consumptionModal').style.display = "none";
  }
  