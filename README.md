# 🛠️ Gestion Maintenance - Application Web

## 📋 Description

Application web moderne pour la gestion de maintenance industrielle avec système de connexion admin/client et fonctionnalités avancées.

## ✨ Fonctionnalités

### 🔐 Système de Connexion
- **Compte Admin** : Accès complet à toutes les fonctionnalités
- **Compte Client** : Accès limité avec formulaires spécialisés

### 👑 Interface Admin
- 📊 **Tableau de bord** avec statistiques
- 🔧 **Gestion des interventions** (voir toutes les demandes)
- 🛒 **Gestion des pièces** de rechange
- 📦 **Gestion des commandes**
- 🔔 **Notifications** des nouvelles demandes

### 👤 Interface Client
- 🔧 **Demandes d'intervention** avec upload d'images
- 🛒 **Commande de pièces** de rechange
- 📋 **Suivi des demandes** personnelles
- 📷 **Upload d'images** pour captures d'écran d'erreur

## 🚀 Installation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel)

### Installation Rapide
1. **Télécharger** tous les fichiers
2. **Ouvrir** `index.html` dans un navigateur
3. **C'est tout !** L'application fonctionne immédiatement

### Installation avec Serveur Local
```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: PHP
php -S localhost:8000
```

## 🔑 Identifiants de Test

### Admin
- **Utilisateur** : `admin`
- **Mot de passe** : `admin123`

### Client
- **Utilisateur** : `pierre.durand`
- **Mot de passe** : `client123`

## 📁 Structure des Fichiers

```
📦 Gestion-Maintenance/
├── 📄 index.html          # Page principale
├── 📄 style.css           # Styles CSS
├── 📄 script.js           # Logique JavaScript
├── 📄 manifest.json       # Configuration PWA
├── 📄 service-worker.js   # Service Worker
├── 📄 logo.png           # Logo de l'application
└── 📄 README.md          # Documentation
```

## 🎨 Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec animations
- **JavaScript ES6+** : Logique interactive
- **Bootstrap 5** : Framework CSS
- **Font Awesome** : Icônes
- **PWA** : Application web progressive

## 🔧 Fonctionnalités Techniques

### 📱 Responsive Design
- Interface adaptée mobile/tablette/desktop
- Navigation tactile optimisée

### 🎯 Système de Privilèges
- **Admin** : Accès complet
- **Client** : Accès limité avec formulaires spécialisés

### 📤 Upload de Fichiers
- Support images (JPG, PNG, GIF)
- Limite 5MB par fichier
- Validation côté client

### 🔔 Notifications
- Notifications push (si autorisées)
- Messages de confirmation
- Alertes d'erreur

## 🚀 Déploiement

### GitHub Pages
1. **Créer** un repository GitHub
2. **Uploader** tous les fichiers
3. **Activer** GitHub Pages dans les paramètres
4. **Accéder** à l'URL générée

### Serveur Web
1. **Uploader** les fichiers sur votre serveur
2. **Configurer** HTTPS (recommandé)
3. **Tester** toutes les fonctionnalités

## 🐛 Résolution de Problèmes

### Problème : Les tableaux ne s'alignent pas
**Solution** : L'application utilise un système CSS avancé. Rechargez la page (Ctrl+F5).

### Problème : Upload d'images ne fonctionne pas
**Solution** : Vérifiez que vous utilisez un navigateur moderne et que les fichiers sont < 5MB.

### Problème : Notifications ne s'affichent pas
**Solution** : Autorisez les notifications dans votre navigateur.

## 📞 Support

Pour toute question ou problème :
- **Email** : support@maintenance-app.com
- **Issues** : Utilisez la section Issues de GitHub

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité
3. **Commit** vos changements
4. **Push** vers la branche
5. **Ouvrir** une Pull Request

---

**Développé avec ❤️ pour la gestion de maintenance industrielle** 