// data.js

/*
  Fonction pour mettre à jour le prix pour une ressource donnée et une unité (1, 10 ou 100).
  Exemple : updateResourcePrice("ortie", "10", 2000)
*/
function updateResourcePrice(resource, unit, value) {
  if (!resourcePrices[resource]) {
    resourcePrices[resource] = {};
  }
  resourcePrices[resource][unit] = value;
}

/*
  Sauvegarde des données (crafts et ingredients) dans le localStorage.
  Les variables globales "crafts" et "ingredients" doivent être définies dans d'autres modules.
*/
function saveData() {
  localStorage.setItem('crafts', JSON.stringify(crafts));
  localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

/*
  Chargement des données depuis le localStorage.
  On s'assure ensuite que les noms sont en minuscules pour éviter toute confusion.
*/
function loadData() {
    console.log("loadData() called");
    const storedCrafts = localStorage.getItem('crafts');
    const storedIngredients = localStorage.getItem('ingredients');
    console.log("Stored crafts:", storedCrafts);
    console.log("Stored ingredients:", storedIngredients);
    if (storedCrafts) {
      crafts = JSON.parse(storedCrafts);
      crafts.forEach(c => {
        c.name = c.name.toLowerCase();
        c.ingredients = c.ingredients.toLowerCase();
      });
    }
    if (storedIngredients) {
      ingredients = JSON.parse(storedIngredients);
      ingredients.forEach(i => {
        i.name = i.name.toLowerCase();
      });
    }
    console.log("Crafts after load:", crafts);
  }
  

/*
  Fonction d'export des données.
  Renvoie une chaîne JSON formatée contenant les crafts et les ingredients.
*/
function exportData() {
  const data = {
    crafts: crafts,
    ingredients: ingredients
  };
  return JSON.stringify(data, null, 2);
}

/*
  Fonction d'import des données depuis une chaîne JSON.
  Remplace les données actuelles par celles importées, sauvegarde et recharge.
*/
function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.crafts && data.ingredients) {
      crafts = data.crafts;
      ingredients = data.ingredients;
      saveData();
      loadData();
      alert("Données importées avec succès !");
    } else {
      alert("Format de données invalide.");
    }
  } catch (error) {
    alert("Erreur lors de l'importation : " + error);
  }
}
