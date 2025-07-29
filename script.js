// --- SINERJI NAT Maintenance - Application Moderne et Animée avec Authentification ---

// Variables globales
let interventions = [];
let pieces = [];
let commandes = [];
let currentModule = 'interventions';
let editIndex = null;
let isAnimating = false;
let currentUser = null;
let isAdmin = false;
let activeUsers = [];
let notifications = [];

// Éléments DOM
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const userLoginForm = document.getElementById('user-login-form');
const adminLoginForm = document.getElementById('admin-login-form');
const tabBtns = document.querySelectorAll('.tab-btn');

const navLinks = {
    interventions: document.getElementById('nav-interventions'),
    pieces: document.getElementById('nav-pieces'),
    commandes: document.getElementById('nav-commandes'),
    dashboard: document.getElementById('nav-dashboard')
};

const modules = {
    interventions: document.getElementById('module-interventions'),
    pieces: document.getElementById('module-pieces'),
    commandes: document.getElementById('module-commandes'),
    dashboard: document.getElementById('module-dashboard')
};

// Modals Bootstrap - Initialisation différée
let interventionModal, pieceModal, commandeModal;

// Boutons
const addInterventionBtn = document.getElementById('add-intervention-btn');
const addPieceBtn = document.getElementById('add-piece-btn');
const addCommandeBtn = document.getElementById('add-commande-btn');
const fab = document.getElementById('fab');
const darkModeToggle = document.getElementById('darkModeToggle');
const logoutBtn = document.getElementById('logout-btn');

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

// User Info Elements
const userNameElement = document.querySelector('.user-name');
const userRoleElement = document.querySelector('.user-role');
const notificationCount = document.querySelector('.notification-count');

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Application SINERJI NAT chargée avec authentification');
    
    // Initialisation des modals Bootstrap
    interventionModal = new bootstrap.Modal(document.getElementById('interventionModal'));
    pieceModal = new bootstrap.Modal(document.getElementById('pieceModal'));
    commandeModal = new bootstrap.Modal(document.getElementById('commandeModal'));
    
    setupLoginSystem();
    loadData();
    setupEventListeners();
    setupAnimations();
    setupScrollEffects();
    
    // Vérifier si l'utilisateur est déjà connecté
    checkAuthStatus();
    
    // Désactiver les notifications pour l'instant
    disableNotifications();
    
    // Correction appliquée via CSS uniquement
});

// Système d'authentification
function setupLoginSystem() {
    // Gestion des onglets de connexion
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Connexion utilisateur
    userLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserLogin();
    });
    
    // Connexion admin
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAdminLogin();
    });
}

function switchTab(tab) {
    // Mise à jour des onglets
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Affichage du formulaire correspondant
    userLoginForm.classList.remove('active');
    adminLoginForm.classList.remove('active');
    
    if (tab === 'user') {
        userLoginForm.classList.add('active');
    } else {
        adminLoginForm.classList.add('active');
    }
}

function handleUserLogin() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const service = document.getElementById('user-service').value;
    
    if (!name || !email || !service) {
        showErrorToast('Veuillez remplir tous les champs');
        return;
    }
    
    // Créer l'utilisateur
    currentUser = {
        name: name,
        email: email,
        service: service,
        role: 'user',
        loginTime: new Date().toISOString()
    };
    
    // Ajouter aux utilisateurs actifs
    addActiveUser(currentUser);
    
    // Sauvegarder la session
    localStorage.setItem('sinerji-currentUser', JSON.stringify(currentUser));
    
    // Afficher l'application
    showMainApp();
    showSuccessToast(`Bienvenue ${name} !`);
}

function handleAdminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Vérification simple (en production, utiliser une vraie authentification)
    if (username === 'admin' && password === 'admin123') {
        currentUser = {
            name: 'Administrateur',
            email: 'admin@sinerji.com',
            service: 'Administration',
            role: 'admin',
            loginTime: new Date().toISOString()
        };
        
        isAdmin = true;
        localStorage.setItem('sinerji-currentUser', JSON.stringify(currentUser));
        localStorage.setItem('sinerji-isAdmin', 'true');
        
        showMainApp();
        showSuccessToast('Connexion administrateur réussie !');
    } else {
        showErrorToast('Identifiants incorrects');
    }
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('sinerji-currentUser');
    const savedAdmin = localStorage.getItem('sinerji-isAdmin');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAdmin = savedAdmin === 'true';
        showMainApp();
    }
}

function showMainApp() {
    loginScreen.classList.add('d-none');
    mainApp.classList.remove('d-none');
    
    // Mettre à jour l'interface utilisateur
    updateUserInterface();
    
    // Initialiser l'application
    setupEventListeners();
    showModule('interventions');
    renderAllTables();
    updateDashboard();
    updateNotifications();
}

function updateUserInterface() {
    if (currentUser) {
        userNameElement.textContent = currentUser.name;
        userRoleElement.textContent = currentUser.service;
        
        // Afficher/masquer les éléments admin
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            if (isAdmin) {
                el.classList.remove('d-none');
            } else {
                el.classList.add('d-none');
            }
        });
    }
}

function addActiveUser(user) {
    const existingUserIndex = activeUsers.findIndex(u => u.email === user.email);
    if (existingUserIndex === -1) {
        activeUsers.push(user);
        localStorage.setItem('sinerji-activeUsers', JSON.stringify(activeUsers));
    }
}

function removeActiveUser(email) {
    activeUsers = activeUsers.filter(u => u.email !== email);
    localStorage.setItem('sinerji-activeUsers', JSON.stringify(activeUsers));
}

function logout() {
    if (currentUser) {
        removeActiveUser(currentUser.email);
    }
    
    currentUser = null;
    isAdmin = false;
    
    localStorage.removeItem('sinerji-currentUser');
    localStorage.removeItem('sinerji-isAdmin');
    
    mainApp.classList.add('d-none');
    loginScreen.classList.remove('d-none');
    
    showSuccessToast('Déconnexion réussie');
}

// Configuration des animations
function setupAnimations() {
    // Animation d'entrée pour les éléments
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer tous les éléments animables avec délai
    setTimeout(() => {
        document.querySelectorAll('.card, .table, .btn').forEach(el => {
            if (el && !el.classList.contains('modal-content')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            }
        });
    }, 100);
}

// Effets de scroll
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.custom-navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Gestion des événements avec animations
function setupEventListeners() {
    // Navigation avec animations
    navLinks.interventions.addEventListener('click', (e) => {
        e.preventDefault();
        animateModuleTransition('interventions');
    });
    navLinks.pieces.addEventListener('click', (e) => {
        e.preventDefault();
        animateModuleTransition('pieces');
    });
    navLinks.commandes.addEventListener('click', (e) => {
        e.preventDefault();
        animateModuleTransition('commandes');
    });
    
    if (isAdmin && navLinks.dashboard) {
        navLinks.dashboard.addEventListener('click', (e) => {
            e.preventDefault();
            animateModuleTransition('dashboard');
        });
    }

    // Boutons d'ajout avec effets
    addInterventionBtn.addEventListener('click', () => {
        addButtonEffect(addInterventionBtn);
        setTimeout(() => openModal('intervention', false), 200);
    });
    
    if (isAdmin) {
        addPieceBtn.addEventListener('click', () => {
            addButtonEffect(addPieceBtn);
            setTimeout(() => openModal('piece', false), 200);
        });
        addCommandeBtn.addEventListener('click', () => {
            addButtonEffect(addCommandeBtn);
            setTimeout(() => openModal('commande', false), 200);
        });
    }
    
    fab.addEventListener('click', () => {
        addButtonEffect(fab);
        setTimeout(() => openModal(currentModule, false), 200);
    });

    // Formulaires avec validation animée
    interventionForm.addEventListener('submit', handleInterventionSubmit);
    if (isAdmin) {
        pieceForm.addEventListener('submit', handlePieceSubmit);
        commandeForm.addEventListener('submit', handleCommandeSubmit);
    }

    // Recherche avec debounce
    searchInputs.interventions.addEventListener('input', debounce((e) => {
        renderTable('interventions', e.target.value);
    }, 300));
    if (isAdmin) {
        searchInputs.pieces.addEventListener('input', debounce((e) => {
            renderTable('pieces', e.target.value);
        }, 300));
        searchInputs.commandes.addEventListener('input', debounce((e) => {
            renderTable('commandes', e.target.value);
        }, 300));
    }

    // Mode sombre avec animation
    darkModeToggle.addEventListener('click', () => {
        addButtonEffect(darkModeToggle);
        setTimeout(toggleDarkMode, 100);
    });
    
    // Déconnexion
    logoutBtn.addEventListener('click', logout);

    // Effets de hover pour les tableaux
    setupTableHoverEffects();
}

// Animation de transition entre modules
function animateModuleTransition(moduleName) {
    if (isAnimating) return;
    isAnimating = true;

    const currentModuleEl = modules[currentModule];
    const newModuleEl = modules[moduleName];

    // Animation de sortie
    currentModuleEl.style.transition = 'all 0.3s ease';
    currentModuleEl.style.opacity = '0';
    currentModuleEl.style.transform = 'translateX(-20px)';

    setTimeout(() => {
        showModule(moduleName);
        
        // Animation d'entrée
        newModuleEl.style.transition = 'all 0.3s ease';
        newModuleEl.style.opacity = '0';
        newModuleEl.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            newModuleEl.style.opacity = '1';
            newModuleEl.style.transform = 'translateX(0)';
            isAnimating = false;
        }, 50);
    }, 300);
}

// Effet de bouton
function addButtonEffect(button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// Navigation entre modules
function showModule(moduleName) {
    currentModule = moduleName;
    
    // Mise à jour de la navigation avec animation
    Object.keys(navLinks).forEach(key => {
        if (navLinks[key]) {
            navLinks[key].classList.remove('active');
            navLinks[key].style.transform = 'scale(1)';
        }
    });
    if (navLinks[moduleName]) {
        navLinks[moduleName].classList.add('active');
        navLinks[moduleName].style.transform = 'scale(1.05)';
    }
    
    // Affichage du module
    Object.keys(modules).forEach(key => {
        if (modules[key]) {
            modules[key].classList.add('d-none');
        }
    });
    if (modules[moduleName]) {
        modules[moduleName].classList.remove('d-none');
    }
    
    // Mise à jour du FAB avec animation
    updateFAB();
}

// Mise à jour du bouton flottant avec animation
function updateFAB() {
    const icons = {
        interventions: 'fa-tools',
        pieces: 'fa-cogs',
        commandes: 'fa-shopping-cart',
        dashboard: 'fa-chart-line'
    };
    
    fab.style.transform = 'scale(0.8) rotate(180deg)';
    fab.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        fab.innerHTML = `<i class="fas ${icons[currentModule]}"></i>`;
        fab.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
}

// Ouverture des modals avec animation
function openModal(type, isEdit = false, index = null) {
    console.log('openModal appelé:', type, isEdit, index);
    
    // Vérifier les permissions
    if (!isAdmin && (type === 'piece' || type === 'commande')) {
        showErrorToast('Accès réservé aux administrateurs');
        return;
    }
    
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
    
    // Vérifier que le modal existe
    if (!config || !config.modal) {
        console.error('Modal non trouvé pour le type:', type);
        showErrorToast('Erreur: Modal non trouvé');
        return;
    }
    
    // Mettre à jour le titre
    const titleElement = document.getElementById(`${type}ModalTitle`);
    if (titleElement) {
        titleElement.textContent = config.title;
    }
    
    if (isEdit && index !== null) {
        console.log('Remplissage du formulaire pour édition...');
        fillForm(type, index);
    } else {
        console.log('Réinitialisation du formulaire...');
        config.form.reset();
        
        // Pré-remplir les champs pour les interventions
        if (type === 'intervention' && currentUser) {
            const dateDemandeField = document.getElementById('dateDemande');
            if (dateDemandeField) {
                dateDemandeField.value = new Date().toISOString().split('T')[0];
            }
        }
    }
    
    // Afficher le modal
    try {
        config.modal.show();
        console.log('Modal affiché avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'affichage du modal:', error);
        showErrorToast('Erreur lors de l\'ouverture du modal');
    }
    
    // Animation d'entrée pour les champs
    setTimeout(() => {
        const inputs = config.form.querySelectorAll('input, select, textarea');
        inputs.forEach((input, index) => {
            input.style.opacity = '0';
            input.style.transform = 'translateY(10px)';
            input.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

// Remplissage des formulaires pour l'édition
function fillForm(type, index) {
    console.log('fillForm appelé avec type:', type, 'index:', index);
    
    const data = getDataByType(type)[index];
    console.log('Données récupérées:', data);
    
    if (!data) {
        console.error('Données non trouvées pour l\'index:', index, 'type:', type);
        showErrorToast('Erreur: Données non trouvées');
        return;
    }
    
    if (type === 'intervention') {
        // Vérifier que tous les éléments existent
        const elements = {
            equipement: document.getElementById('equipement'),
            dateDemande: document.getElementById('dateDemande'),
            datePrevue: document.getElementById('datePrevue'),
            statut: document.getElementById('statut'),
            priorite: document.getElementById('priorite'),
            typeIntervention: document.getElementById('typeIntervention'),
            description: document.getElementById('description'),
            piecesNecessaires: document.getElementById('piecesNecessaires'),
            notes: document.getElementById('notes')
        };
        
        // Vérifier si tous les éléments existent
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error('Élément non trouvé:', key);
                showErrorToast(`Erreur: Élément ${key} non trouvé`);
                return;
            }
        }
        
        // Remplir les champs
        elements.equipement.value = data.equipement || '';
        elements.dateDemande.value = data.dateDemande || '';
        elements.datePrevue.value = data.datePrevue || '';
        elements.statut.value = data.statut || 'Demande';
        elements.priorite.value = data.priorite || 'Normale';
        elements.typeIntervention.value = data.typeIntervention || 'Préventive';
        elements.description.value = data.description || '';
        elements.piecesNecessaires.value = data.piecesNecessaires || '';
        elements.notes.value = data.notes || '';
        
        console.log('Formulaire d\'intervention rempli avec succès');
    } else if (type === 'piece') {
        document.getElementById('piece-nom').value = data.nom || '';
        document.getElementById('piece-reference').value = data.reference || '';
        document.getElementById('piece-stock').value = data.stock || 0;
        document.getElementById('piece-prix').value = data.prix || '';
        document.getElementById('piece-fournisseur').value = data.fournisseur || '';
        document.getElementById('piece-description').value = data.description || '';
    } else if (type === 'commande') {
        document.getElementById('commande-numero').value = data.numero || '';
        document.getElementById('commande-date').value = data.date || '';
        document.getElementById('commande-fournisseur').value = data.fournisseur || '';
        document.getElementById('commande-montant').value = data.montant || '';
        document.getElementById('commande-statut').value = data.statut || 'En attente';
        document.getElementById('commande-pieces').value = data.pieces || '';
        document.getElementById('commande-notes').value = data.notes || '';
    }
}

// Gestion des soumissions de formulaires avec animations
function handleInterventionSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showErrorToast('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const formData = new FormData(e.target);
    
    const intervention = {
        equipement: formData.get('equipement') || document.getElementById('equipement').value,
        demandeur: currentUser.name,
        service: currentUser.service,
        dateDemande: formData.get('dateDemande') || document.getElementById('dateDemande').value,
        datePrevue: document.getElementById('datePrevue').value || '',
        statut: formData.get('statut') || document.getElementById('statut').value,
        priorite: formData.get('priorite') || document.getElementById('priorite').value,
        typeIntervention: document.getElementById('typeIntervention').value || '',
        description: formData.get('description') || document.getElementById('description').value,
        piecesNecessaires: document.getElementById('piecesNecessaires').value || '',
        notes: document.getElementById('notes').value || '',
        createdAt: new Date().toISOString()
    };
    
    if (editIndex !== null) {
        intervention.createdAt = interventions[editIndex].createdAt;
        interventions[editIndex] = intervention;
        showSuccessToast('Intervention modifiée avec succès !');
        addNotification('Intervention modifiée', `${intervention.equipement} a été modifié`, 'info');
    } else {
        interventions.push(intervention);
        showSuccessToast('Nouvelle intervention créée !');
        addNotification('Nouvelle intervention', `${intervention.equipement} a été créé par ${currentUser.name}`, 'success');
        // Notifier l'admin
        sendAdminNotification('Nouvelle intervention', `${intervention.equipement} demandée par ${intervention.demandeur}`);
    }
    
    saveData();
    renderTable('interventions', searchInputs.interventions.value);
    updateDashboard();
    interventionModal.hide();
    editIndex = null;
}

function handlePieceSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showErrorToast('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const piece = {
        nom: document.getElementById('piece-nom').value,
        reference: document.getElementById('piece-reference').value,
        stock: parseInt(document.getElementById('piece-stock').value),
        prix: parseFloat(document.getElementById('piece-prix').value) || 0,
        fournisseur: document.getElementById('piece-fournisseur').value || '',
        description: document.getElementById('piece-description').value || '',
        createdAt: new Date().toISOString()
    };
    
    if (editIndex !== null) {
        piece.createdAt = pieces[editIndex].createdAt;
        pieces[editIndex] = piece;
        showSuccessToast('Pièce modifiée avec succès !');
        addNotification('Pièce modifiée', `${piece.nom} a été modifié`, 'info');
    } else {
        pieces.push(piece);
        showSuccessToast('Nouvelle pièce ajoutée !');
        addNotification('Nouvelle pièce', `${piece.nom} a été ajoutée`, 'success');
    }
    
    saveData();
    renderTable('pieces', searchInputs.pieces.value);
    updateDashboard();
    pieceModal.hide();
    editIndex = null;
}

function handleCommandeSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showErrorToast('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const commande = {
        numero: document.getElementById('commande-numero').value,
        date: document.getElementById('commande-date').value,
        fournisseur: document.getElementById('commande-fournisseur').value,
        montant: parseFloat(document.getElementById('commande-montant').value) || 0,
        statut: document.getElementById('commande-statut').value,
        pieces: document.getElementById('commande-pieces').value || '',
        notes: document.getElementById('commande-notes').value || '',
        createdAt: new Date().toISOString()
    };
    
    if (editIndex !== null) {
        commande.createdAt = commandes[editIndex].createdAt;
        commandes[editIndex] = commande;
        showSuccessToast('Commande modifiée avec succès !');
        addNotification('Commande modifiée', `${commande.numero} a été modifié`, 'info');
    } else {
        commandes.push(commande);
        showSuccessToast('Nouvelle commande ajoutée !');
        addNotification('Nouvelle commande', `${commande.numero} a été créée`, 'success');
    }
    
    saveData();
    renderTable('commandes', searchInputs.commandes.value);
    updateDashboard();
    commandeModal.hide();
    editIndex = null;
}

// Validation de formulaire
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger-color)';
            field.style.animation = 'glitch 0.3s ease-in-out';
            isValid = false;
        } else {
            field.style.borderColor = '';
            field.style.animation = '';
        }
    });
    
    return isValid;
}

// Rendu des tableaux avec animations
function renderTable(type, filter = '') {
    const tbody = document.getElementById(`${type}-body`);
    let data = getDataByType(type);
    // Loguer le contenu réel pour debug
    console.log(`[DEBUG] renderTable(${type}) data:`, data);
    
    if (!tbody) {
        console.error(`Tableau ${type} non trouvé`);
        return;
    }
    
    // Filtrage utilisateur : un utilisateur ne voit que ses propres interventions
    if (type === 'interventions' && !isAdmin && currentUser) {
        data = data.filter(item => item.demandeur === currentUser.name);
    }
    
    // Animation de chargement
    tbody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="loading-spinner"></div> Chargement...</td></tr>';
    
    setTimeout(() => {
        tbody.innerHTML = '';
        
        const filteredData = data.filter(item => {
            if (!filter) return true;
            const searchTerm = filter.toLowerCase();
            
            switch (type) {
                case 'interventions':
                    return (item.equipement || '').toLowerCase().includes(searchTerm) ||
                           (item.demandeur || '').toLowerCase().includes(searchTerm) ||
                           (item.statut || '').toLowerCase().includes(searchTerm);
                case 'pieces':
                    return (item.nom || '').toLowerCase().includes(searchTerm) ||
                           (item.reference || '').toLowerCase().includes(searchTerm);
                case 'commandes':
                    return (item.numero || '').toLowerCase().includes(searchTerm) ||
                           (item.fournisseur || '').toLowerCase().includes(searchTerm) ||
                           (item.statut || '').toLowerCase().includes(searchTerm);
            }
        });
        
        if (filteredData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        <i class="fas fa-search fa-2x mb-2"></i>
                        <br>Aucun résultat trouvé
                    </td>
                </tr>
            `;
            return;
        }
        
        filteredData.forEach((item, index) => {
            const row = createTableRow(type, item, index);
            if (row) {
                row.style.opacity = '0';
                row.style.transform = 'translateX(-20px)';
                tbody.appendChild(row);
                setTimeout(() => {
                    row.style.transition = 'all 0.3s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, 300);
}

function createTableRow(type, item, index) {
    const row = document.createElement('tr');
    
    if (type === 'interventions') {
        // FORCER L'ORDRE EXACT DES COLONNES
        row.innerHTML = `<td style="width: 20%; vertical-align: middle; word-wrap: break-word;"><strong>${item.equipement || 'Équipement non spécifié'}</strong></td><td style="width: 15%; vertical-align: middle;"><div style="display: flex; flex-direction: column; gap: 0.25rem;"><span style="font-weight: 500;">${item.demandeur || 'Demandeur non spécifié'}</span><small style="color: #6B7280; font-size: 0.75rem;">${item.service || 'Service non spécifié'}</small></div></td><td style="width: 12%; vertical-align: middle; text-align: center;">${formatDate(item.dateDemande || '')}</td><td style="width: 12%; vertical-align: middle; text-align: center;">${item.datePrevue ? formatDate(item.datePrevue) : '-'}</td><td style="width: 12%; vertical-align: middle; text-align: center;"><span class="badge badge-status-${getStatusClass(item.statut || 'Demande')}" style="min-width: 80px; padding: 0.5rem 1rem;">${item.statut || 'Demande'}</span></td><td style="width: 12%; vertical-align: middle; text-align: center;"><span class="badge badge-priority-${(item.priorite || 'Normale').toLowerCase()}" style="min-width: 80px; padding: 0.5rem 1rem;">${item.priorite || 'Normale'}</span></td><td style="width: 17%; vertical-align: middle; text-align: center;"><div style="display: flex; justify-content: center; gap: 0.5rem;">${isAdmin ? `<button class="btn btn-sm btn-edit" onclick="openModal('intervention', true, ${index})" title="Modifier" style="padding: 0.375rem 0.75rem;"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-delete" onclick="confirmDelete('interventions', ${index})" title="Supprimer" style="padding: 0.375rem 0.75rem;"><i class="fas fa-trash"></i></button>` : `<button class="btn btn-sm btn-primary" onclick="openModal('intervention', true, ${index})" title="Voir les détails" style="padding: 0.375rem 0.75rem;"><i class="fas fa-eye"></i></button>`}</div></td>`;
    } else if (type === 'pieces') {
        // FORCER L'ORDRE EXACT DES COLONNES POUR LES PIÈCES
        row.innerHTML = `<td style="width: 20%; vertical-align: middle;"><strong>${item.nom || 'Nom non spécifié'}</strong></td><td style="width: 15%; vertical-align: middle;"><code>${item.reference || 'Référence non spécifiée'}</code></td><td style="width: 10%; vertical-align: middle; text-align: center;"><span class="badge ${(item.stock || 0) > 5 ? 'bg-success' : 'bg-warning'}">${item.stock || 0}</span></td><td style="width: 12%; vertical-align: middle; text-align: center;">${item.prix ? item.prix.toFixed(2) + ' €' : '-'}</td><td style="width: 20%; vertical-align: middle;">${item.fournisseur || '-'}</td><td style="width: 23%; vertical-align: middle; text-align: center;"><div style="display: flex; justify-content: center; gap: 0.5rem;"><button class="btn btn-sm btn-edit" onclick="openModal('piece', true, ${index})" title="Modifier" style="padding: 0.375rem 0.75rem;"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-delete" onclick="confirmDelete('pieces', ${index})" title="Supprimer" style="padding: 0.375rem 0.75rem;"><i class="fas fa-trash"></i></button></div></td>`;
        
    } else if (type === 'commandes') {
        // FORCER L'ORDRE EXACT DES COLONNES POUR LES COMMANDES
        row.innerHTML = `<td style="width: 15%; vertical-align: middle;"><strong>${item.numero || 'Numéro non spécifié'}</strong></td><td style="width: 12%; vertical-align: middle; text-align: center;">${formatDate(item.date || '')}</td><td style="width: 20%; vertical-align: middle;">${item.fournisseur || 'Fournisseur non spécifié'}</td><td style="width: 12%; vertical-align: middle; text-align: center;">${item.montant ? item.montant.toFixed(2) + ' €' : '-'}</td><td style="width: 15%; vertical-align: middle; text-align: center;"><span class="badge badge-status-${getStatusClass(item.statut || 'En attente')}" style="min-width: 80px; padding: 0.5rem 1rem;">${item.statut || 'En attente'}</span></td><td style="width: 26%; vertical-align: middle; text-align: center;"><div style="display: flex; justify-content: center; gap: 0.5rem;"><button class="btn btn-sm btn-edit" onclick="openModal('commande', true, ${index})" title="Modifier" style="padding: 0.375rem 0.75rem;"><i class="fas fa-edit"></i></button><button class="btn btn-sm btn-delete" onclick="confirmDelete('commandes', ${index})" title="Supprimer" style="padding: 0.375rem 0.75rem;"><i class="fas fa-trash"></i></button></div></td>`;
    }
    
    // Debug: Afficher le HTML généré
    console.log('[DEBUG] Ligne HTML générée pour', type, ':', row.innerHTML);
    
    return row;
}

// Effets de hover pour les tableaux
function setupTableHoverEffects() {
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('tr')) {
            const row = e.target.closest('tr');
            if (row.parentElement.tagName === 'TBODY') {
                row.style.transform = 'scale(1.01)';
                row.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('tr')) {
            const row = e.target.closest('tr');
            if (row.parentElement.tagName === 'TBODY') {
                row.style.transform = 'scale(1)';
                row.style.boxShadow = 'none';
            }
        }
    });
}

// Fonctions utilitaires
function getDataByType(type) {
    console.log('getDataByType appelé avec type:', type);
    
    let data;
    switch (type) {
        case 'intervention':
        case 'interventions':
            data = interventions;
            break;
        case 'piece':
        case 'pieces':
            data = pieces;
            break;
        case 'commande':
        case 'commandes':
            data = commandes;
            break;
        default:
            data = [];
    }
    
    console.log('Données retournées pour', type, ':', data);
    
    // Vérifier que les données existent et sont un tableau
    if (!Array.isArray(data)) {
        console.error('Les données pour', type, 'ne sont pas un tableau:', data);
        return [];
    }
    
    return data;
}

function getStatusClass(statut) {
    const statusMap = {
        'Demande': 'afaire',
        'En cours': 'encours',
        'Terminé': 'termine',
        'Annulé': 'afaire',
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

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Actions sur les données avec animations
function confirmDelete(type, index) {
    if (!isAdmin) {
        showErrorToast('Accès réservé aux administrateurs');
        return;
    }
    
    const typeNames = {
        interventions: 'intervention',
        pieces: 'pièce',
        commandes: 'commande'
    };
    
    const dialog = createConfirmationDialog(
        `Supprimer cette ${typeNames[type]} ?`,
        () => {
            deleteItem(type, index);
            dialog.remove();
        },
        () => {
            dialog.remove();
        }
    );
    
    document.body.appendChild(dialog);
    setTimeout(() => dialog.classList.add('show'), 10);
}

function deleteItem(type, index) {
    const button = event.target.closest('button');
    button.style.transform = 'scale(0.8) rotate(180deg)';
    button.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        const item = getDataByType(type)[index];
        getDataByType(type).splice(index, 1);
        saveData();
        renderTable(type, searchInputs[type].value);
        updateDashboard();
        showSuccessToast('Élément supprimé avec succès !');
        addNotification('Élément supprimé', `${typeNames[type]} supprimé`, 'warning');
    }, 300);
}

// Création de dialogue de confirmation
function createConfirmationDialog(message, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    dialog.innerHTML = `
        <div class="p-4">
            <h5 class="mb-3">Confirmation</h5>
            <p class="mb-4">${message}</p>
            <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-secondary" onclick="this.closest('.confirmation-dialog').remove()">Annuler</button>
                <button class="btn btn-danger">Confirmer</button>
            </div>
        </div>
    `;
    
    dialog.querySelector('.btn-danger').addEventListener('click', onConfirm);
    dialog.querySelector('.btn-secondary').addEventListener('click', onCancel);
    
    return dialog;
}

// Système de notifications
function addNotification(title, message, type = 'info') {
    const notification = {
        id: Date.now(),
        title: title,
        message: message,
        type: type,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notifications.unshift(notification);
    localStorage.setItem('sinerji-notifications', JSON.stringify(notifications));
    updateNotifications();
}

function updateNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown) return;
    
    const unreadNotifications = notifications.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) {
        dropdown.innerHTML = `
            <li><h6 class="dropdown-header">Notifications</h6></li>
            <li><hr class="dropdown-divider"></li>
            <li class="no-notifications">Aucune notification</li>
        `;
    } else {
        const notificationsList = unreadNotifications.slice(0, 5).map(notification => `
            <li>
                <a class="dropdown-item" href="#" onclick="markNotificationAsRead(${notification.id})">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-${getNotificationIcon(notification.type)} me-2 text-${getNotificationColor(notification.type)}"></i>
                        <div>
                            <div class="fw-bold">${notification.title}</div>
                            <small class="text-muted">${notification.message}</small>
                        </div>
                    </div>
                </a>
            </li>
        `).join('');
        
        dropdown.innerHTML = `
            <li><h6 class="dropdown-header">Notifications</h6></li>
            <li><hr class="dropdown-divider"></li>
            ${notificationsList}
            ${unreadNotifications.length > 5 ? '<li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-center" href="#">Voir toutes</a></li>' : ''}
        `;
    }
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'success',
        error: 'danger',
        warning: 'warning',
        info: 'info'
    };
    return colors[type] || 'info';
}

function markNotificationAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        localStorage.setItem('sinerji-notifications', JSON.stringify(notifications));
        updateNotifications();
        updateNotificationDropdown();
    }
}

function updateNotifications() {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (notificationCount) {
        notificationCount.textContent = unreadCount;
        
        if (unreadCount > 0) {
            notificationCount.style.display = 'block';
        } else {
            notificationCount.style.display = 'none';
        }
    }
    
    updateNotificationDropdown();
}

function disableNotifications() {
    // Masquer complètement le bouton de notifications
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
        notificationBtn.style.display = 'none';
    }
}

// Tableau de bord
function updateDashboard() {
    if (!isAdmin) return;
    
    // Statistiques
    document.getElementById('total-interventions').textContent = interventions.length;
    document.getElementById('pending-interventions').textContent = interventions.filter(i => i.statut === 'Demande').length;
    document.getElementById('completed-interventions').textContent = interventions.filter(i => i.statut === 'Terminé').length;
    document.getElementById('total-commandes').textContent = commandes.length;
    
    // Activité récente
    updateRecentActivity();
    
    // Utilisateurs actifs
    updateActiveUsers();
}

function updateRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;
    
    const allActivities = [
        ...interventions.map(i => ({
            type: 'intervention',
            title: `Intervention ${i.statut}`,
            message: `${i.equipement} - ${i.demandeur}`,
            time: i.createdAt,
            icon: 'fa-tools',
            color: 'bg-primary'
        })),
        ...pieces.map(p => ({
            type: 'piece',
            title: 'Pièce ajoutée',
            message: `${p.nom} (${p.reference})`,
            time: p.createdAt,
            icon: 'fa-cogs',
            color: 'bg-success'
        })),
        ...commandes.map(c => ({
            type: 'commande',
            title: 'Commande créée',
            message: `${c.numero} - ${c.fournisseur}`,
            time: c.createdAt,
            icon: 'fa-shopping-cart',
            color: 'bg-info'
        }))
    ];
    
    // Trier par date et prendre les 10 plus récentes
    const recentActivities = allActivities
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10);
    
    activityContainer.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.color}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-title">${activity.title}</p>
                <p class="activity-time">${activity.message} - ${formatDate(activity.time)}</p>
            </div>
        </div>
    `).join('');
}

function updateActiveUsers() {
    const usersContainer = document.getElementById('active-users');
    if (!usersContainer) return;
    
    usersContainer.innerHTML = activeUsers.map(user => `
        <div class="user-item">
            <div class="user-avatar">
                ${user.name.charAt(0).toUpperCase()}
            </div>
            <div class="user-details">
                <p class="user-name-list">${user.name}</p>
                <p class="user-service">${user.service}</p>
            </div>
        </div>
    `).join('');
}

// Toast notifications
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'bg-danger text-white' : 'bg-success text-white'}`;
    toast.innerHTML = `
        <div class="toast-body d-flex align-items-center">
            <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showSuccessToast(message) {
    showToast(message, 'success');
}

function showErrorToast(message) {
    showToast(message, 'error');
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Mode sombre avec animation
function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    
    const icon = darkModeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    icon.style.transform = 'rotate(180deg)';
    icon.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        icon.style.transform = 'rotate(0deg)';
    }, 150);
    
    localStorage.setItem('darkMode', !isDark);
    
    showSuccessToast(isDark ? 'Mode clair activé' : 'Mode sombre activé');
}

// Persistance des données
function saveData() {
    localStorage.setItem('sinerji-interventions', JSON.stringify(interventions));
    localStorage.setItem('sinerji-pieces', JSON.stringify(pieces));
    localStorage.setItem('sinerji-commandes', JSON.stringify(commandes));
    localStorage.setItem('sinerji-notifications', JSON.stringify(notifications));
}

function loadData() {
    // Forcer la réinitialisation à chaque chargement
    interventions = getDefaultInterventions();
    pieces = getDefaultPieces();
    commandes = getDefaultCommandes();
    notifications = [];
    activeUsers = [];
    saveData();
    console.log('[DEBUG] Données interventions:', interventions);
    console.log('[DEBUG] Données pieces:', pieces);
    console.log('[DEBUG] Données commandes:', commandes);
}

function resetAllData() {
    console.log('Réinitialisation de toutes les données...');
    localStorage.removeItem('sinerji-interventions');
    localStorage.removeItem('sinerji-pieces');
    localStorage.removeItem('sinerji-commandes');
    localStorage.removeItem('sinerji-notifications');
    localStorage.removeItem('sinerji-activeUsers');
    console.log('Données réinitialisées');
}

function cleanInterventionsData(data) {
    return data.map(item => ({
        equipement: item.equipement || 'Équipement non spécifié',
        demandeur: item.demandeur || 'Demandeur non spécifié',
        service: item.service || 'Service non spécifié',
        dateDemande: item.dateDemande || new Date().toISOString().split('T')[0],
        datePrevue: item.datePrevue || '',
        statut: item.statut || 'Demande',
        priorite: item.priorite || 'Normale',
        typeIntervention: item.typeIntervention || 'Préventive',
        description: item.description || 'Description non spécifiée',
        piecesNecessaires: item.piecesNecessaires || '',
        notes: item.notes || '',
        createdAt: item.createdAt || new Date().toISOString()
    }));
}

function cleanPiecesData(data) {
    return data.map(item => ({
        nom: item.nom || 'Nom non spécifié',
        reference: item.reference || 'REF-000',
        stock: parseInt(item.stock) || 0,
        prix: parseFloat(item.prix) || 0,
        fournisseur: item.fournisseur || '',
        description: item.description || '',
        createdAt: item.createdAt || new Date().toISOString()
    }));
}

function cleanCommandesData(data) {
    return data.map(item => ({
        numero: item.numero || 'CMD-000',
        date: item.date || new Date().toISOString().split('T')[0],
        fournisseur: item.fournisseur || 'Fournisseur non spécifié',
        montant: parseFloat(item.montant) || 0,
        statut: item.statut || 'En attente',
        pieces: item.pieces || '',
        notes: item.notes || '',
        createdAt: item.createdAt || new Date().toISOString()
    }));
}

function renderAllTables() {
    console.log('Rendu de tous les tableaux...');
    
    // Forcer le rendu des tableaux
    setTimeout(() => {
        renderTable('interventions');
        if (isAdmin) {
            renderTable('pieces');
            renderTable('commandes');
        }
        console.log('Tous les tableaux rendus');
        
        // Correction appliquée via CSS uniquement
    }, 100);
}

// Données par défaut
function getDefaultInterventions() {
    return [
        {
            equipement: 'Pompe hydraulique',
            demandeur: 'Jean Dupont',
            service: 'Production',
            dateDemande: '2024-06-01',
            datePrevue: '2024-06-05',
            statut: 'En cours',
            priorite: 'Haute',
            typeIntervention: 'Corrective',
            description: 'Fuite d\'huile importante',
            piecesNecessaires: 'Joint d\'étanchéité',
            notes: 'Intervention urgente',
            createdAt: '2024-06-01T08:00:00.000Z'
        },
        {
            equipement: 'Compresseur d\'air',
            demandeur: 'Marie Martin',
            service: 'Maintenance',
            dateDemande: '2024-05-15',
            datePrevue: '2024-05-20',
            statut: 'Terminé',
            priorite: 'Normale',
            typeIntervention: 'Préventive',
            description: 'Maintenance préventive annuelle',
            piecesNecessaires: 'Filtre à air',
            notes: 'Intervention planifiée',
            createdAt: '2024-05-15T10:30:00.000Z'
        },
        {
            equipement: 'Système de ventilation',
            demandeur: 'Pierre Durand',
            service: 'Qualité',
            dateDemande: '2024-06-10',
            datePrevue: '2024-06-12',
            statut: 'Demande',
            priorite: 'Normale',
            typeIntervention: 'Préventive',
            description: 'Nettoyage des filtres et vérification du système',
            piecesNecessaires: 'Filtres à air',
            notes: 'Maintenance régulière',
            createdAt: '2024-06-10T09:15:00.000Z'
        }
    ];
}

function getDefaultPieces() {
    return [
        { nom: 'Joint d\'étanchéité', reference: 'JNT-001', stock: 12, prix: 5.50, fournisseur: 'Fournisseur A', description: 'Joint en caoutchouc', createdAt: '2024-01-01T00:00:00.000Z' },
        { nom: 'Filtre à air', reference: 'FLT-002', stock: 5, prix: 15.00, fournisseur: 'Fournisseur B', description: 'Filtre haute performance', createdAt: '2024-01-01T00:00:00.000Z' },
        { nom: 'Roulement à billes', reference: 'RBL-003', stock: 8, prix: 25.00, fournisseur: 'Fournisseur C', description: 'Roulement industriel', createdAt: '2024-01-01T00:00:00.000Z' }
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
            pieces: 'Joint d\'étanchéité x10',
            notes: 'Commande urgente',
            createdAt: '2024-06-10T09:00:00.000Z'
        },
        {
            numero: 'CMD-2024-002',
            date: '2024-06-12',
            fournisseur: 'Fournisseur B',
            montant: 75.50,
            statut: 'Livrée',
            pieces: 'Filtre à air x5',
            notes: 'Livraison conforme',
            createdAt: '2024-06-12T14:30:00.000Z'
        }
    ];
}

// Fonction manquante pour les commandes
function toggleCommande(index) {
    console.log('toggleCommande appelé avec index:', index);
    openModal('commande', true, index);
}

// Fonctions globales pour les onclick
window.toggleCommande = toggleCommande;
window.deleteItem = deleteItem;
window.openModal = openModal;
window.confirmDelete = confirmDelete; 

// Notification push + email pour l'admin
function sendAdminNotification(title, message) {
    // Push notification navigateur
    if (window.Notification && Notification.permission === 'granted') {
        new Notification(title, { body: message });
    } else if (window.Notification && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body: message });
            }
        });
    }
    // Email (exemple avec EmailJS ou à brancher sur un backend)
    if (window.emailjs) {
        emailjs.send('service_id', 'template_id', {
            to_email: 'admin@votre-domaine.com',
            subject: title,
            message: message
        });
    } else {
        // À brancher sur un backend réel si besoin
        console.log('[ADMIN EMAIL]', title, message);
    }
}

// Appel lors de la création d'une intervention
function handleInterventionSubmit(e) {
    e.preventDefault();
    if (!validateForm(e.target)) {
        showErrorToast('Veuillez remplir tous les champs obligatoires');
        return;
    }
    const formData = new FormData(e.target);
    const intervention = {
        equipement: formData.get('equipement') || document.getElementById('equipement').value,
        demandeur: currentUser.name,
        service: currentUser.service,
        dateDemande: formData.get('dateDemande') || document.getElementById('dateDemande').value,
        datePrevue: document.getElementById('datePrevue').value || '',
        statut: formData.get('statut') || document.getElementById('statut').value,
        priorite: formData.get('priorite') || document.getElementById('priorite').value,
        typeIntervention: document.getElementById('typeIntervention').value || '',
        description: formData.get('description') || document.getElementById('description').value,
        piecesNecessaires: document.getElementById('piecesNecessaires').value || '',
        notes: document.getElementById('notes').value || '',
        createdAt: new Date().toISOString()
    };
    if (editIndex !== null) {
        intervention.createdAt = interventions[editIndex].createdAt;
        interventions[editIndex] = intervention;
        showSuccessToast('Intervention modifiée avec succès !');
        addNotification('Intervention modifiée', `${intervention.equipement} a été modifié`, 'info');
    } else {
        interventions.push(intervention);
        showSuccessToast('Nouvelle intervention créée !');
        addNotification('Nouvelle intervention', `${intervention.equipement} demandée par ${intervention.demandeur}`, 'success');
        // Notifier l'admin
        sendAdminNotification('Nouvelle intervention', `${intervention.equipement} demandée par ${intervention.demandeur}`);
    }
    saveData();
    renderTable('interventions');
    updateDashboard();
    interventionModal.hide();
} 