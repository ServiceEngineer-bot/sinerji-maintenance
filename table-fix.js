// ========================================
// SOLUTION RADICALE - CORRECTION TABLEAUX
// ========================================

console.log('🔧 Chargement de la solution de correction des tableaux...');

// Fonction principale de correction
function fixTableAlignment() {
    console.log('🔧 Application de la correction des tableaux...');
    
    // Attendre que le DOM soit chargé
    setTimeout(() => {
        applyTableFixes();
    }, 1000);
}

function applyTableFixes() {
    const tables = ['interventions-table', 'pieces-table', 'commandes-table'];
    
    tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (!table) {
            console.log(`❌ Tableau ${tableId} non trouvé`);
            return;
        }
        
        console.log(`🔧 Correction du tableau: ${tableId}`);
        
        // 1. Forcer les styles de base du tableau
        table.style.cssText = `
            table-layout: fixed !important;
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 0.875rem !important;
        `;
        
        // 2. Réinitialiser tous les th et td
        const allCells = table.querySelectorAll('th, td');
        allCells.forEach(cell => {
            cell.style.cssText = `
                box-sizing: border-box !important;
                padding: 0.5rem 0.75rem !important;
                border-bottom: 1px solid #e5e7eb !important;
                vertical-align: middle !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                white-space: nowrap !important;
            `;
        });
        
        // 3. Styles spécifiques pour les headers
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            header.style.cssText += `
                background-color: #f8f9fa !important;
                font-weight: 600 !important;
                font-size: 0.75rem !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
                border-bottom: 2px solid #dee2e6 !important;
            `;
        });
        
        // 4. Styles spécifiques pour les cellules
        const cells = table.querySelectorAll('td');
        cells.forEach(cell => {
            cell.style.cssText += `
                background-color: #fff !important;
                font-size: 0.875rem !important;
            `;
        });
        
        // 5. Appliquer les largeurs spécifiques
        applySpecificWidths(table, tableId);
    });
    
    console.log('✅ Correction des tableaux terminée');
}

function applySpecificWidths(table, tableId) {
    let widths = [];
    
    // Définir les largeurs selon le tableau
    switch(tableId) {
        case 'interventions-table':
            widths = [20, 15, 12, 12, 12, 12, 17];
            break;
        case 'pieces-table':
            widths = [20, 15, 10, 12, 20, 23];
            break;
        case 'commandes-table':
            widths = [15, 12, 20, 12, 15, 26];
            break;
    }
    
    // Appliquer les largeurs
    const headers = table.querySelectorAll('th');
    const firstRow = table.querySelector('tbody tr');
    if (!firstRow) return;
    
    const cells = firstRow.querySelectorAll('td');
    
    widths.forEach((width, index) => {
        if (headers[index]) {
            headers[index].style.width = width + '% !important';
            headers[index].style.minWidth = (width * 8) + 'px !important';
        }
        if (cells[index]) {
            cells[index].style.width = width + '% !important';
            cells[index].style.minWidth = (width * 8) + 'px !important';
        }
    });
}

// Fonction de diagnostic
function diagnosticTable() {
    console.log('🔍 DIAGNOSTIC DES TABLEAUX');
    
    const tables = ['interventions-table', 'pieces-table', 'commandes-table'];
    
    tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (!table) {
            console.log(`❌ Tableau ${tableId} non trouvé`);
            return;
        }
        
        console.log(`\n📊 ANALYSE: ${tableId}`);
        
        const headers = table.querySelectorAll('th');
        const firstRow = table.querySelector('tbody tr');
        if (!firstRow) {
            console.log('❌ Aucune ligne de données');
            return;
        }
        
        const cells = firstRow.querySelectorAll('td');
        
        console.log(`Headers: ${headers.length}, Cells: ${cells.length}`);
        
        headers.forEach((header, index) => {
            const cell = cells[index];
            if (cell) {
                const headerText = header.textContent.trim();
                const cellText = cell.textContent.trim();
                const headerWidth = header.offsetWidth;
                const cellWidth = cell.offsetWidth;
                
                console.log(`Colonne ${index + 1}:`);
                console.log(`  Header: "${headerText}" (${headerWidth}px)`);
                console.log(`  Cell: "${cellText}" (${cellWidth}px)`);
                console.log(`  Différence: ${Math.abs(headerWidth - cellWidth)}px`);
            }
        });
    });
}

// Fonction de vérification
function verifierResultat() {
    console.log('✅ VÉRIFICATION DU RÉSULTAT');
    
    const tables = ['interventions-table', 'pieces-table', 'commandes-table'];
    
    tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const headers = table.querySelectorAll('th');
        const firstRow = table.querySelector('tbody tr');
        if (!firstRow) return;
        
        const cells = firstRow.querySelectorAll('td');
        
        console.log(`\n📊 VÉRIFICATION: ${tableId}`);
        
        headers.forEach((header, index) => {
            const cell = cells[index];
            if (cell) {
                const headerWidth = header.offsetWidth;
                const cellWidth = cell.offsetWidth;
                const difference = Math.abs(headerWidth - cellWidth);
                
                if (difference <= 2) {
                    console.log(`✅ Colonne ${index + 1}: OK (différence: ${difference}px)`);
                } else {
                    console.log(`❌ Colonne ${index + 1}: PROBLÈME (différence: ${difference}px)`);
                }
            }
        });
    });
}

// Exposer les fonctions globalement
window.fixTableAlignment = fixTableAlignment;
window.diagnosticTable = diagnosticTable;
window.verifierResultat = verifierResultat;

// Appliquer automatiquement la correction au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application automatique de la correction des tableaux...');
    fixTableAlignment();
});

// Appliquer aussi après le rendu des tableaux
setTimeout(() => {
    fixTableAlignment();
}, 2000);

console.log('✅ Script de correction des tableaux chargé');
console.log('📝 Commandes disponibles:');
console.log('  - fixTableAlignment() : Appliquer la correction');
console.log('  - diagnosticTable() : Diagnostiquer les problèmes');
console.log('  - verifierResultat() : Vérifier le résultat'); 