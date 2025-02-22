// production.js

// Fonction de parsing d'un ingrédient (ex: "1 ortie" => {quantity: 1, name: "ortie"})
function parseIngredientPart(part) {
    let tokens = part.trim().split(/\s+/);
    if (tokens.length < 2) return null;
    let quantity = parseInt(tokens[0]);
    if (isNaN(quantity)) return null;
    let name = tokens.slice(1).join(" ");
    return { quantity, name };
  }
  
  // Récupère l'inventaire sous forme d'objet { resourceName: quantity }
  function getInventoryObject() {
    let invObj = {};
    ingredients.forEach(item => {
      let key = item.name.toLowerCase();
      invObj[key] = (invObj[key] || 0) + item.quantity;
    });
    return invObj;
  }
  
  // Fonction récursive qui produit un item et retourne un objet contenant:
  // - net: les ressources à acheter (si le craft est nécessaire)
  // - detailsHTML: le détail hiérarchisé de la production
  function produceWithDetails(itemName, quantity, inv) {
    let key = itemName.toLowerCase();
    let available = inv[key] || 0;
    let used = Math.min(available, quantity);
    inv[key] = available - used;
    let detailsHTML = "";
    if (used > 0) {
      detailsHTML += `<li>${used}x ${formatDisplayName(itemName)} (inventaire)</li>`;
    }
    let remainder = quantity - used;
    let net = {};
    if (remainder <= 0) {
      return { net, detailsHTML: `<ul>${detailsHTML}</ul>` };
    }
    // Si l'item est craftable, on récupère la recette
    let craft = crafts.find(c => c.name.toLowerCase() === key);
    if (craft) {
      detailsHTML += `<li><span class="title">${remainder}x ${formatDisplayName(itemName)}</span></li><li><ul>`;
      let parts = craft.ingredients.split(',');
      parts.forEach(part => {
        let parsed = parseIngredientPart(part);
        if (!parsed) return;
        let reqQuantity = remainder * parsed.quantity;
        let result = produceWithDetails(parsed.name, reqQuantity, inv);
        let inner = result.detailsHTML;
        if (inner.startsWith("<ul>") && inner.endsWith("</ul>")) {
          inner = inner.substring(4, inner.length - 5).trim();
        }
        if (/^<li>.*\(inventaire\)<\/li>$/.test(inner)) {
          detailsHTML += inner;
        } else {
          detailsHTML += `<li><span class="title">${reqQuantity}x ${formatDisplayName(parsed.name)}:</span>${result.detailsHTML}</li>`;
        }
        for (let raw in result.net) {
          net[raw] = (net[raw] || 0) + result.net[raw];
        }
      });
      detailsHTML += `</ul></li>`;
    } else {
      // Si l'item n'est pas craftable, il faut l'acheter
      detailsHTML += `<li>${remainder}x ${formatDisplayName(itemName)} (achat)</li>`;
      net[key] = remainder;
    }
    return { net, detailsHTML: `<ul>${detailsHTML}</ul>` };
  }
  
  // Essaie de produire l'item une seule fois, en utilisant l'inventaire donné.
  // Si la production est possible (aucune ressource à acheter), on met à jour l'inventaire.
  function tryProduceOne(itemName, inv) {
    let invCopy = Object.assign({}, inv);
    let result = produceWithDetails(itemName, 1, invCopy);
    if (Object.keys(result.net).length === 0) {
      // Production possible : on répercute la consommation sur l'inventaire d'origine
      for (let k in invCopy) {
        inv[k] = invCopy[k];
      }
      return true;
    }
    return false;
  }
  
  // Calcule le nombre maximum de productions possibles pour un item donné
  function maxProduction(itemName) {
    let inv = getInventoryObject();
    let count = 0;
    while (tryProduceOne(itemName, inv)) {
      count++;
    }
    return count;
  }
  