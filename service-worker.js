// --- SINERJI NAT Maintenance - Application Moderne ---

// Variables globales
let interventions = [];
let pieces = [];
let commandes = [];
let currentModule = 'interventions';
let editIndex = null;

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application SINERJI NAT chargée');
    initializeApp();
});

function initializeApp() {
    loadData();
    setupNavigation();
    setupButtons();
    setupForms();
    setupSearch();
    showModule('interventions');
    renderAllTables();
}

// Navigation entre modules
function setupNavigation() {
    const navInterventions = document.getElementById('nav-interventions');
    const navPieces = document.getElementById('nav-pieces');
    const navCommandes = document.getElementById('nav-commandes');
    
    if (navInterventions) navInterventions.addEventListener('click', () => showModule('interventions'));
    if (navPieces) navPieces.addEventListener('click', () => showModule('pieces'));
    if (navCommandes) navCommandes.addEventListener('click', () => showModule('commandes'));
}

function showModule(moduleName) {
    console.log('Changement vers module:', moduleName);
    currentModule = moduleName;
    
    // Masquer tous les modules
    const modules = ['interventions', 'pieces', 'commandes'];
    modules.forEach(module => {
        const element = document.getElementById(`module-${module}`);
        if (element) element.classList.add('d-none');
    });
    
    // Afficher le module sélectionné
    const selectedModule = document.getElementById(`module-${moduleName}`);
    if (selectedModule) selectedModule.classList.remove('d-none');
    
    // Mettre à jour la navigation
    const navLinks = ['nav-interventions', 'nav-pieces', 'nav-commandes'];
    navLinks.forEach(navId => {
        const navElement = document.getElementById(navId);
        if (navElement) navElement.classList.remove('active');
    });
    
    const activeNav = document.getElementById(`nav-${moduleName}`);
    if (activeNav) activeNav.classList.add('active');
    
    // Mettre à jour le FAB
    updateFAB();
}

function updateFAB() {
    const fab = document.getElementById('fab');
    if (!fab) return;
    
    const icons = {
        interventions: 'fa-tools',
        pieces: 'fa-cogs',
        commandes: 'fa-shopping-cart'
    };
    fab.innerHTML = `<i class="fas ${icons[currentModule]}"></i>`;
}

// Configuration des boutons
function setupButtons() {
    // Boutons d'ajout
    const addInterventionBtn = document.getElementById('add-intervention-btn');
    const addPieceBtn = document.getElementById('add-piece-btn');
    const addCommandeBtn = document.getElementById('add-commande-btn');
    const fab = document.getElementById('fab');
    
    if (addInterventionBtn) addInterventionBtn.addEventListener('click', () => openModal('intervention'));
    if (addPieceBtn) addPieceBtn.addEventListener('click', () => openModal('piece'));
    if (addCommandeBtn) addCommandeBtn.addEventListener('click', () => openModal('commande'));
    if (fab) fab.addEventListener('click', () => openModal(currentModule));
    
    // Mode sombre
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
}

// Ouverture des modals
function openModal(type, isEdit = false, index = null) {
    console.log('Ouverture modal:', type, 'edit:', isEdit, 'index:', index);
    editIndex = index;
    
    let modalElement;
    let titleElement;
    
    switch(type) {
        case 'intervention':
            modalElement = document.getElementById('interventionModal');
            titleElement = document.getElementById('interventionModalTitle');
            break;
        case 'piece':
            modalElement = document.getElementById('pieceModal');
            titleElement = document.getElementById('pieceModalTitle');
            break;
        case 'commande':
            modalElement = document.getElementById('commandeModal');
            titleElement = document.getElementById('commandeModalTitle');
            break;
    }
    
    if (!modalElement) {
        console.error('Modal non trouvé:', type);
        return;
    }
    
    // Mettre à jour le titre
    if (titleElement) {
        titleElement.textContent = isEdit ? `Modifier ${getTypeName(type)}` : `Nouveau ${getTypeName(type)}`;
    }
    
    // Remplir le formulaire si édition
    if (isEdit && index !== null) {
        fillForm(type, index);
    } else {
        resetForm(type);
    }
    
    // Ouvrir le modal avec Bootstrap
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function getTypeName(type) {
    const names = {
        intervention: 'intervention',
        piece: 'pièce',
        commande: 'commande'
    };
    return names[type] || type;
}

function resetForm(type) {
    const forms = {
        intervention: 'intervention-form',
        piece: 'piece-form',
        commande: 'commande-form'
    };
    
    const formId = forms[type];
    if (formId) {
        const form = document.getElementById(formId);
        if (form) form.reset();
    }
}

function fillForm(type, index) {
    const data = getDataByType(type)[index];
    if (!data) return;
    
    switch(type) {
        case 'intervention':
            setFormValue('equipement', data.equipement);
            setFormValue('dateDerniere', data.dateDerniere);
            setFormValue('dateProchaine', data.dateProchaine);
            setFormValue('statut', data.statut);
            setFormValue('piece', data.piece || '');
            setFormValue('notes', data.notes || '');
            break;
        case 'piece':
            setFormValue('piece-nom', data.nom);
            setFormValue('piece-reference', data.reference);
            setFormValue('piece-stock', data.stock);
            setFormValue('piece-prix', data.prix || '');
            break;
        case 'commande':
            setFormValue('commande-numero', data.numero);
            setFormValue('commande-date', data.date);
            setFormValue('commande-fournisseur', data.fournisseur);
            setFormValue('commande-montant', data.montant || '');
            setFormValue('commande-statut', data.statut);
            setFormValue('commande-notes', data.notes || '');
            break;
    }
}

function setFormValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value;
}

// Configuration des formulaires
function setupForms() {
    const interventionForm = document.getElementById('intervention-form');
    const pieceForm = document.getElementById('piece-form');
    const commandeForm = document.getElementById('commande-form');
    
    if (interventionForm) interventionForm.addEventListener('submit', handleInterventionSubmit);
    if (pieceForm) pieceForm.addEventListener('submit', handlePieceSubmit);
    if (commandeForm) commandeForm.addEventListener('submit', handleCommandeSubmit);
}

// Gestion des soumissions
function handleInterventionSubmit(e) {
    e.preventDefault();
    
    const intervention = {
        equipement: document.getElementById('equipement').value,
        dateDerniere: document.getElementById('dateDerniere').value,
        dateProchaine: document.getElementById('dateProchaine').value,
        statut: document.getElementById('statut').value,
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
    renderTable('interventions');
    closeModal('intervention');
}

function handlePieceSubmit(e) {
    e.preventDefault();
    
    const piece = {
        nom: document.getElementById('piece-nom').value,
        reference: document.getElementById('piece-reference').value,
        stock: parseInt(document.getElementById('piece-stock').value) || 0,
        prix: parseFloat(document.getElementById('piece-prix').value) || 0
    };
    
    if (editIndex !== null) {
        pieces[editIndex] = piece;
    } else {
        pieces.push(piece);
    }
    
    saveData();
    renderTable('pieces');
    closeModal('piece');
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
    renderTable('commandes');
    closeModal('commande');
}

function closeModal(type) {
    const modalIds = {
        intervention: 'interventionModal',
        piece: 'pieceModal',
        commande: 'commandeModal'
    };
    
    const modalId = modalIds[type];
    if (modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
    }
    
    editIndex = null;
}

// Configuration de la recherche
function setupSearch() {
    const searchInputs = {
        interventions: document.getElementById('search-interventions'),
        pieces: document.getElementById('search-pieces'),
        commandes: document.getElementById('search-commandes')
    };
    
    Object.keys(searchInputs).forEach(type => {
        const input = searchInputs[type];
        if (input) {
            input.addEventListener('input', (e) => renderTable(type, e.target.value));
        }
    });
}

// Rendu des tableaux
function renderTable(type, filter = '') {
    const tbody = document.getElementById(`${type}-body`);
    if (!tbody) return;
    
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
    renderTable('interventions');
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
        renderTable(type);
    }
}

// Mode sombre
function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const icon = darkModeToggle.querySelector('i');
        if (icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
    
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
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        }
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