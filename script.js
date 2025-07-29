// --- SINERJI NAT Maintenance - Application Moderne ---

// Variables globales
let interventions = [];
let pieces = [];
let commandes = [];
let currentModule = 'interventions';
let editIndex = null;

// Éléments DOM
const navLinks = {
    interventions: document.getElementById('nav-interventions'),
    pieces: document.getElementById('nav-pieces'),
    commandes: document.getElementById('nav-commandes')
};

const modules = {
    interventions: document.getElementById('module-interventions'),
    pieces: document.getElementById('module-pieces'),
    commandes: document.getElementById('module-commandes')
};

// Modals Bootstrap
const interventionModal = new bootstrap.Modal(document.getElementById('interventionModal'));
const pieceModal = new bootstrap.Modal(document.getElementById('pieceModal'));
const commandeModal = new bootstrap.Modal(document.getElementById('commandeModal'));

// Boutons
const addInterventionBtn = document.getElementById('add-intervention-btn');
const addPieceBtn = document.getElementById('add-piece-btn');
const addCommandeBtn = document.getElementById('add-commande-btn');
const fab = document.getElementById('fab');
const darkModeToggle = document.getElementById('darkModeToggle');

// Formulaires
const interventionForm = document.getElementById('intervention-form');
const pieceForm = document.getElementById('piece-form');
const commandeForm = document.getElementById('commande-form');

// Recherche
const searchInputs = {
    interventions: document.getElementById('search-interventions'),
    pieces: document.getElementById('search-pieces'),
    commandes: document.getElementById('search-commandes')
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    showModule('interventions');
    renderAllTables();
});

// Gestion des événements
function setupEventListeners() {
    // Navigation
    navLinks.interventions.addEventListener('click', () => showModule('interventions'));
    navLinks.pieces.addEventListener('click', () => showModule('pieces'));
    navLinks.commandes.addEventListener('click', () => showModule('commandes'));

    // Boutons d'ajout
    addInterventionBtn.addEventListener('click', () => openModal('intervention', false));
    addPieceBtn.addEventListener('click', () => openModal('piece', false));
    addCommandeBtn.addEventListener('click', () => openModal('commande', false));
    fab.addEventListener('click', () => openModal(currentModule, false));

    // Formulaires
    interventionForm.addEventListener('submit', handleInterventionSubmit);
    pieceForm.addEventListener('submit', handlePieceSubmit);
    commandeForm.addEventListener('submit', handleCommandeSubmit);

    // Recherche
    searchInputs.interventions.addEventListener('input', (e) => renderTable('interventions', e.target.value));
    searchInputs.pieces.addEventListener('input', (e) => renderTable('pieces', e.target.value));
    searchInputs.commandes.addEventListener('input', (e) => renderTable('commandes', e.target.value));

    // Mode sombre
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

// Navigation entre modules
function showModule(moduleName) {
    currentModule = moduleName;
    
    // Mise à jour de la navigation
    Object.keys(navLinks).forEach(key => {
        navLinks[key].classList.remove('active');
    });
    navLinks[moduleName].classList.add('active');
    
    // Affichage du module
    Object.keys(modules).forEach(key => {
        modules[key].classList.add('d-none');
    });
    modules[moduleName].classList.remove('d-none');
    
    // Mise à jour du FAB
    updateFAB();
}

// Mise à jour du bouton flottant
function updateFAB() {
    const icons = {
        interventions: 'fa-tools',
        pieces: 'fa-cogs',
        commandes: 'fa-shopping-cart'
    };
    fab.innerHTML = `<i class="fas ${icons[currentModule]}"></i>`;
}

// Ouverture des modals
function openModal(type, isEdit = false, index = null) {
    editIndex = index;
    
    const modalConfigs = {
        intervention: {
            modal: interventionModal,
            title: isEdit ? 'Modifier l\'intervention' : 'Nouvelle intervention',
            form: interventionForm
        },
        piece: {
            modal: pieceModal,
            title: isEdit ? 'Modifier la pièce' : 'Nouvelle pièce',
            form: pieceForm
        },
        commande: {
            modal: commandeModal,
            title: isEdit ? 'Modifier la commande' : 'Nouvelle commande',
            form: commandeForm
        }
    };
    
    const config = modalConfigs[type];
    document.getElementById(`${type}ModalTitle`).textContent = config.title;
    
    if (isEdit && index !== null) {
        fillForm(type, index);
    } else {
        config.form.reset();
    }
    
    config.modal.show();
}

// Remplissage des formulaires pour l'édition
function fillForm(type, index) {
    const data = getDataByType(type)[index];
    
    if (type === 'intervention') {
        document.getElementById('equipement').value = data.equipement;
        document.getElementById('dateDerniere').value = data.dateDerniere;
        document.getElementById('dateProchaine').value = data.dateProchaine;
        document.getElementById('statut').value = data.statut;
        document.getElementById('piece').value = data.piece || '';
        document.getElementById('notes').value = data.notes || '';
    } else if (type === 'piece') {
        document.getElementById('piece-nom').value = data.nom;
        document.getElementById('piece-reference').value = data.reference;
        document.getElementById('piece-stock').value = data.stock;
        document.getElementById('piece-prix').value = data.prix || '';
    } else if (type === 'commande') {
        document.getElementById('commande-numero').value = data.numero;
        document.getElementById('commande-date').value = data.date;
        document.getElementById('commande-fournisseur').value = data.fournisseur;
        document.getElementById('commande-montant').value = data.montant || '';
        document.getElementById('commande-statut').value = data.statut;
        document.getElementById('commande-notes').value = data.notes || '';
    }
}

// Gestion des soumissions de formulaires
function handleInterventionSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const intervention = {
        equipement: formData.get('equipement') || document.getElementById('equipement').value,
        dateDerniere: formData.get('dateDerniere') || document.getElementById('dateDerniere').value,
        dateProchaine: formData.get('dateProchaine') || document.getElementById('dateProchaine').value,
        statut: formData.get('statut') || document.getElementById('statut').value,
        piece: document.getElementById('piece').value,
        notes: document.getElementById('notes').value,
        commande: false
    };
    
    if (editIndex !== null) {
        intervention.commande = interventions[editIndex].commande;
        interventions[editIndex] = intervention;
    } else {
        interventions.push(intervention);
    }
    
    saveData();
    renderTable('interventions', searchInputs.interventions.value);
    interventionModal.hide();
    editIndex = null;
}

function handlePieceSubmit(e) {
    e.preventDefault();
    
    const piece = {
        nom: document.getElementById('piece-nom').value,
        reference: document.getElementById('piece-reference').value,
        stock: parseInt(document.getElementById('piece-stock').value),
        prix: parseFloat(document.getElementById('piece-prix').value) || 0
    };
    
    if (editIndex !== null) {
        pieces[editIndex] = piece;
    } else {
        pieces.push(piece);
    }
    
    saveData();
    renderTable('pieces', searchInputs.pieces.value);
    pieceModal.hide();
    editIndex = null;
}

function handleCommandeSubmit(e) {
    e.preventDefault();
    
    const commande = {
        numero: document.getElementById('commande-numero').value,
        date: document.getElementById('commande-date').value,
        fournisseur: document.getElementById('commande-fournisseur').value,
        montant: parseFloat(document.getElementById('commande-montant').value) || 0,
        statut: document.getElementById('commande-statut').value,
        notes: document.getElementById('commande-notes').value
    };
    
    if (editIndex !== null) {
        commandes[editIndex] = commande;
    } else {
        commandes.push(commande);
    }
    
    saveData();
    renderTable('commandes', searchInputs.commandes.value);
    commandeModal.hide();
    editIndex = null;
}

// Rendu des tableaux
function renderTable(type, filter = '') {
    const tbody = document.getElementById(`${type}-body`);
    const data = getDataByType(type);
    
    tbody.innerHTML = '';
    
    const filteredData = data.filter(item => {
        if (!filter) return true;
        const searchTerm = filter.toLowerCase();
        
        switch (type) {
            case 'interventions':
                return item.equipement.toLowerCase().includes(searchTerm) ||
                       (item.piece && item.piece.toLowerCase().includes(searchTerm)) ||
                       item.statut.toLowerCase().includes(searchTerm);
            case 'pieces':
                return item.nom.toLowerCase().includes(searchTerm) ||
                       item.reference.toLowerCase().includes(searchTerm);
            case 'commandes':
                return item.numero.toLowerCase().includes(searchTerm) ||
                       item.fournisseur.toLowerCase().includes(searchTerm) ||
                       item.statut.toLowerCase().includes(searchTerm);
        }
    });
    
    filteredData.forEach((item, index) => {
        const row = createTableRow(type, item, index);
        tbody.appendChild(row);
    });
}

function createTableRow(type, item, index) {
    const row = document.createElement('tr');
    
    switch (type) {
        case 'interventions':
            row.innerHTML = `
                <td>${item.equipement}</td>
                <td>${formatDate(item.dateDerniere)}</td>
                <td>${formatDate(item.dateProchaine)}</td>
                <td><span class="badge badge-status-${getStatusClass(item.statut)}">${item.statut}</span></td>
                <td>${item.piece || '-'}</td>
                <td>
                    <button class="btn btn-sm ${item.commande ? 'btn-success' : 'btn-outline-success'}" 
                            onclick="toggleCommande(${index})">
                        <i class="fas ${item.commande ? 'fa-check' : 'fa-truck'}"></i>
                        ${item.commande ? 'Commandée' : 'Commander'}
                    </button>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-edit me-1" onclick="openModal('intervention', true, ${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteItem('interventions', ${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            break;
            
        case 'pieces':
            row.innerHTML = `
                <td>${item.nom}</td>
                <td>${item.reference}</td>
                <td><span class="badge ${item.stock > 5 ? 'bg-success' : 'bg-warning'}">${item.stock}</span></td>
                <td>${item.prix ? item.prix.toFixed(2) + ' €' : '-'}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-edit me-1" onclick="openModal('piece', true, ${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteItem('pieces', ${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            break;
            
        case 'commandes':
            row.innerHTML = `
                <td>${item.numero}</td>
                <td>${formatDate(item.date)}</td>
                <td>${item.fournisseur}</td>
                <td>${item.montant ? item.montant.toFixed(2) + ' €' : '-'}</td>
                <td><span class="badge badge-status-${getStatusClass(item.statut)}">${item.statut}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-edit me-1" onclick="openModal('commande', true, ${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteItem('commandes', ${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            break;
    }
    
    return row;
}

// Fonctions utilitaires
function getDataByType(type) {
    switch (type) {
        case 'interventions': return interventions;
        case 'pieces': return pieces;
        case 'commandes': return commandes;
    }
}

function getStatusClass(statut) {
    const statusMap = {
        'À faire': 'afaire',
        'En cours': 'encours',
        'Terminé': 'termine',
        'En attente': 'afaire',
        'Confirmée': 'encours',
        'Livrée': 'termine',
        'Annulée': 'afaire'
    };
    return statusMap[statut] || 'afaire';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Actions sur les données
function toggleCommande(index) {
    interventions[index].commande = !interventions[index].commande;
    saveData();
    renderTable('interventions', searchInputs.interventions.value);
}

function deleteItem(type, index) {
    const typeNames = {
        interventions: 'intervention',
        pieces: 'pièce',
        commandes: 'commande'
    };
    
    if (confirm(`Supprimer cette ${typeNames[type]} ?`)) {
        getDataByType(type).splice(index, 1);
        saveData();
        renderTable(type, searchInputs[type].value);
    }
}

// Mode sombre
function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    
    const icon = darkModeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    
    localStorage.setItem('darkMode', !isDark);
}

// Persistance des données
function saveData() {
    localStorage.setItem('sinerji-interventions', JSON.stringify(interventions));
    localStorage.setItem('sinerji-pieces', JSON.stringify(pieces));
    localStorage.setItem('sinerji-commandes', JSON.stringify(commandes));
}

function loadData() {
    interventions = JSON.parse(localStorage.getItem('sinerji-interventions')) || getDefaultInterventions();
    pieces = JSON.parse(localStorage.getItem('sinerji-pieces')) || getDefaultPieces();
    commandes = JSON.parse(localStorage.getItem('sinerji-commandes')) || getDefaultCommandes();
    
    // Mode sombre
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

function renderAllTables() {
    renderTable('interventions');
    renderTable('pieces');
    renderTable('commandes');
}

// Données par défaut
function getDefaultInterventions() {
    return [
        {
            equipement: 'Pompe hydraulique',
            dateDerniere: '2024-06-01',
            dateProchaine: '2024-09-01',
            statut: 'À faire',
            piece: 'Joint d\'étanchéité',
            notes: 'Vérifier la pression',
            commande: false
        },
        {
            equipement: 'Compresseur d\'air',
            dateDerniere: '2024-05-15',
            dateProchaine: '2024-08-15',
            statut: 'En cours',
            piece: 'Filtre à air',
            notes: 'Remplacement préventif',
            commande: true
        }
    ];
}

function getDefaultPieces() {
    return [
        { nom: 'Joint d\'étanchéité', reference: 'JNT-001', stock: 12, prix: 5.50 },
        { nom: 'Filtre à air', reference: 'FLT-002', stock: 5, prix: 15.00 },
        { nom: 'Roulement à billes', reference: 'RBL-003', stock: 8, prix: 25.00 }
    ];
}

function getDefaultCommandes() {
    return [
        {
            numero: 'CMD-2024-001',
            date: '2024-06-10',
            fournisseur: 'Fournisseur A',
            montant: 150.00,
            statut: 'En attente',
            notes: 'Commande urgente'
        },
        {
            numero: 'CMD-2024-002',
            date: '2024-06-12',
            fournisseur: 'Fournisseur B',
            montant: 75.50,
            statut: 'Livrée',
            notes: 'Livraison conforme'
        }
    ];
}

// Fonctions globales pour les onclick
window.toggleCommande = toggleCommande;
window.deleteItem = deleteItem;
window.openModal = openModal; 