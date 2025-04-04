# FinancialHub
![image](https://github.com/isabellaaquino/financialhub/assets/76221367/7b7dc6e9-4279-4fff-9e19-04b4394252e9)

## Overview 📝

This repository contains a finance management web application built with **Django** and **React.js**. The main goal of this project is to ~~make myself a finance tracker because i'm terrible at saving money~~ provide a user-friendly solution for managing your personal finances, tracking transactions, and gaining insights into your earnings and expenses.

While we don't host this on a cloud solution, you can try this app following the steps described [here](#installation-%EF%B8%8F).

## Features 🚀

### Transaction Management 💸

- Create transactions for transfers, earnings, and expenses.
- Track transaction details such as date, amount, and description.
- Create your own personalized labels for transactions for easier filtering.
- Import payment invoices (Brazilian PIX only)
- Create recurrent transactions ❗

### Monthly Earnings and Expense Analysis 📈

- Visualize your earning and expenses using interactive graphs and charts.
- Get a clear overview of your financial trends over time.
- Analyze your spending habits and identify areas for improvement.

### SavingPlans 🐖 ❗

- Create personalized saving plans tailored to your specific goals.
- Set savings targets and monitor your progress.
- Get reminders and notifications to stay on track with your savings.

#### Items followed by an ❗ are items that already started being implemented, but are yet to be released for usage

## Installation ⚙️

To run the application locally, please follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/isabellaaquino/financialhub.git
   ```

2. Install dependencies for the Django backend:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up the Django database:

   ```bash
   python manage.py migrate
   ```

4. Install dependencies for the React.js frontend:

   ```bash
   cd ../frontend
   npm install
   ```

5. Start the development server:

   ```bash
   npm start
   ```

6. Access the application in your browser at `http://localhost:5173`.

## About the project 🧑‍🎓

Although this project is a work in progress (and will be for a long time), our kanban board and issues are public, and can be accessed [here](https://github.com/users/isabellaaquino/projects/1/views/1). We would love to know your ideas, suggestions and reviews!

Another thing worth being said is that we are both undergrad compsci students, and we try to allocate time to work on this whenever we can. Along with that, we also want to add that we have an initial UML modelling made on Visual Paradigm that is being made for studying purposes and can be accessed through `backend/modelling`.

Last but not least, stars are appreciated! 🤩

## Usage 💡

Once the application is up and running, you can perform the following tasks:

- Register a new user account or log in with an existing account.
- Create transactions by specifying the type (earning or expense) and categorize them as you wish, creating your own labels.
- View and analyze your monthly earnings and expenses through interactive graphs and charts.

## Roadmap 🗺️

The following features are planned for future development:

- Report generation and advanced insights for better financial analysis.
- Budgeting tools to help you plan and manage your expenses effectively.
- Recurrent transactions to facilitate expenses that happen every month

## License 📄

This project will be soon licensed under the MIT License. You are free to use, modify, and distribute this software for personal purposes.

## Authors ✍️

This project is thought, planned and implemented by [Isabella Aquino](https://github.com/isabellaaquino) (backend heavy) & [Pedro Dell'Olio](https://github.com/pedrodellolio) (frontend heavy)



## ReadMe Maintenance

# FinancialHub - Fork SL/SC/PL
![image](https://github.com/isabellaaquino/financialhub/assets/76221367/7b7dc6e9-4279-4fff-9e19-04b4394252e9)

## Présentation 📝

Ce dépôt contient une application web de gestion financière développée avec **Django** et **React.js**. L’objectif initial du projet est de proposer une solution simple et intuitive pour gérer ses finances personnelles, suivre ses transactions et analyser ses revenus et dépenses.
 
Bien que l’application ne soit pas encore hébergée en ligne, il est possible de la tester en local en suivant les instructions ci-dessous.

---

## Fonctionnalités principales 🚀

### Gestion des transactions 💸

- Création de transactions (revenus, dépenses, virements)
- Suivi des détails : date, montant, description
- Création d’étiquettes personnalisées pour filtrer les transactions
- Import de factures de paiement (uniquement via le système brésilien PIX)
- Création de transactions récurrentes ❗

### Analyse mensuelle des revenus et dépenses 📈

- Visualisation des finances sous forme de graphiques interactifs
- Analyse des tendances et habitudes de dépenses
- Recommandations pour améliorer sa gestion budgétaire

### Plans d’épargne 🐖 ❗

- Création de plans d’épargne personnalisés selon les objectifs de l’utilisateur
- Suivi des objectifs et rappels automatiques
- Notifications pour rester motivé

> ❗ : Fonctionnalité commencée mais non finalisée ou non encore disponible

---

## 🛠️ Objectif du Fork : Amélioration de FinancialHub

Ce fork vise à stabiliser et améliorer l’application existante. Le travail est mené en équipe de 3 personnes, en se concentrant sur la correction de bugs, la fluidité de l’interface et l’expérience utilisateur.

### ✅ Périmètre de maintenance initial :

**1. Stabilité & correction de bugs**
- Résolution des erreurs critiques empêchant le bon fonctionnement global
- Meilleure gestion des données échangées entre le front et le back
- Stabilisation de l’import des factures PIX et des transactions récurrentes

**2. Ergonomie et accessibilité**
- Interface plus fluide, responsive sur tous supports
- Meilleure navigation au clavier, contraste et accessibilité générale

**3. Sécurité**
- Vérification des pratiques de sécurité côté API
- Renforcement de la gestion des sessions et de l’authentification

### 🔧 Évolutions envisagées si la base devient stable :
- Finalisation des fonctionnalités en attente (❗)
- Ajout d’une fonctionnalité de **budget mensuel**
- Amélioration du tableau de bord avec filtres dynamiques
- Meilleure gestion des utilisateurs

---

## 👥 Rôles et organisation de l’équipe (MOE)


Initiales
Rôle principal
Missions techniques confiées
SL
Frontend / UI/UX
Interface, responsive design, ergonomie, accessibilité
PL
Frontend / UI/UX
Composants réutilisables, navigation, cohérence visuelle
SC
Backend / API
Debug API Django, logique métier, gestion des données
SL / PL / SC
Intégration / QA
Lancement local, tests fonctionnels, validation des interfaces et des flux

|

> 📌 Les rôles sont susceptibles d’évoluer selon les besoins et les avancées du projet.

---

## Installation en local ⚙️

Pour lancer l’application en local :

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/ton-fork/financialhub.git

