// modals.js

// Modal Reset Données
// Ouvre le modal de gestion des données
function openDataManagerModal() {
  document.getElementById("dataManagerModal").style.display = "block";
  // Affiche le premier onglet par défaut
  openTab(null, 'exportTab');
}

// Ferme le modal de gestion des données
function closeDataManagerModal() {
  document.getElementById("dataManagerModal").style.display = "none";
}

// Gère l'ouverture d'un onglet dans le modal
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  // Masque tous les contenus d'onglet
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  // Supprime la classe active de tous les onglets
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  // Affiche le contenu de l'onglet sélectionné
  document.getElementById(tabName).style.display = "block";
  if (evt) {
    evt.currentTarget.classList.add("active");
  } else {
    // Si aucun événement n'est fourni, on active le premier onglet
    if(tablinks.length) {
      tablinks[0].classList.add("active");
    }
  }
  // Si on ouvre l'onglet Export, met à jour le textarea avec l'export des données
  if (tabName === "exportTab") {
    document.getElementById("exportTextarea").value = exportData();
  }
}
  
// Fonction d'import (doImportData) qui utilise la fonction importData() déjà définie dans data.js
function doImportData() {
  const jsonString = document.getElementById("importTextarea").value;
  importData(jsonString);
  closeDataManagerModal();
}
