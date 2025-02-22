// profitability.js

function calculateProfitability() {
    const tbody = document.querySelector('#profitTable tbody');
    tbody.innerHTML = "";
    let computedList = [];
    crafts.forEach(craft => {
      const possibleCount = maxProduction(craft.name);
      if (possibleCount > 0) {
        const profit = possibleCount * (craft.resaleValue / 10);
        computedList.push({ craft: craft, possibleCount: possibleCount, profit: profit });
      }
    });
    if (profitFilterText) {
      computedList = computedList.filter(item => {
        return item.craft.name.includes(profitFilterText) ||
               item.craft.ingredients.includes(profitFilterText) ||
               String(item.craft.resaleValue).includes(profitFilterText) ||
               String(item.possibleCount).includes(profitFilterText) ||
               String(item.profit).includes(profitFilterText);
      });
    }
    if (profitSort.column) {
      computedList.sort((a, b) => {
        let aVal, bVal;
        if (profitSort.column === "craft") {
          aVal = a.craft.name;
          bVal = b.craft.name;
        } else if (profitSort.column === "possibleCount") {
          aVal = a.possibleCount;
          bVal = b.possibleCount;
        } else if (profitSort.column === "profit") {
          aVal = a.profit;
          bVal = b.profit;
        }
        if (typeof aVal === "number") {
          return profitSort.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
          if (aVal < bVal) return profitSort.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return profitSort.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    }
    computedList.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDisplayName(item.craft.name)}</td>
        <td>${item.possibleCount}</td>
        <td>${item.profit.toFixed(2)}</td>
        <td><button onclick="openConsumptionDetailModal('${item.craft.id}')">Détails</button></td>
      `;
      tr.id = "profit_" + item.craft.id;
      tbody.appendChild(tr);
    });
    updateProfitSortIndicators();
    if (computedList.length > 0) {
      let best = computedList.reduce((max, cur) => cur.profit > max.profit ? cur : max, computedList[0]);
      const bestRow = document.getElementById("profit_" + best.craft.id);
      if (bestRow) {
        bestRow.style.backgroundColor = document.body.classList.contains("dark-theme") ? "#4caf50" : "#b2dba1";
      }
    }
  }
  