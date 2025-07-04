# 📚 Projet de Gestion de Bibliothèque Universitaire

Ce projet est une application web moderne développée avec **Next.js** pour la gestion d’une bibliothèque universitaire.  
Il propose une interface pour les **étudiants** et une interface d’administration pour les **administrateurs**.

---

## ✨ Fonctionnalités

### 👩‍🎓 Étudiants
- S’inscrire et se connecter
- Parcourir la liste des livres
- Emprunter des livres
- Laisser des avis

### 👩‍💼 Administrateurs
- Gérer les étudiants
- Ajouter, modifier ou supprimer des livres
- Gérer les emprunts

---

## 🔑 Accès Admin (pour tests)

Pour vous connecter en tant qu’**administrateur**, utilisez :

- **Email** : `sawadogoimaane@gmail.com`  
- **Mot de passe** : `123456`

> Ces identifiants sont valables uniquement en local, avec la base de données correctement initialisée.

---

## 🚀 Lancer le projet localement

### Prérequis

- Node.js ≥ 18.x
- MySQL installé localement
- Créer un fichier `.env` à partir du modèle `.env.example` avec les bonnes valeurs

### Installation

```bash
# Cloner le projet
git clone https://github.com/Imaane200/Projet_Bibliotheque_2ie.git

# Se déplacer dans le dossier
cd Projet_Bibliotheque_2ie

# Installer les dépendances
npm install

# Lancer le serveur en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🧠 Technologies utilisées

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **Express.js** côté backend
- **MySQL** (via `mysql2`)
- **JWT** pour l’authentification
- **bcryptjs** pour le hachage des mots de passe

---

## 📄 Licence

Ce projet est distribué sous licence MIT.  
Vous êtes libre de le modifier et de le réutiliser dans un cadre personnel ou académique.

---

## 👤 Auteure

**SAWADOGO Imaane**  
Étudiante en Informatique Intelligence Artificielle et Application à 2iE  
Email : sawadogoimaane@gmail.com
