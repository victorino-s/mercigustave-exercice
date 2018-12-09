# Architecture

Pour cet exercice, j'ai décidé de séparer le sytème en 3 parties :

- Une application cliente pour le formulaire
- Une application cliente pour le dashboard
- Le serveur sous forme d'API

Une base de données MongoDb fait aussi partie du système afin de stocker les différentes commandes passées au moyen du formulaire.

Le formulaire permet d'entrer les différentes informations nécessaires pour passer une commande, et d'envoyer au serveur cette dernière.

Le serveur quant à lui, transmet les informations de la commande directement à la base de données, dans la table "orders".

Enfin, le dashboard permet d'afficher les différentes commandes présentes dans la base de données ainsi que leur statut : acceptée ou rejetée.

Si le statut d'une commande n'a pas encore été décidé, alors l'utilisateur peut choisir d'accepter ou de refuser la commande au moyen des boutons de selection affichés.

Lorsque l'utilisateur met à jour le statut d'une commande, le dashboard contacte le serveur afin que celui-ci mette à jour le statut de la commande dans la base de donnée et qu'il envoit un email à la personne ayant passé la commande.

# Procédure d'installation

- Ouvrez une fenêtre console puis naviguez jusqu'au dossier où vous souhaitez télécharger le projet.

- Executez la commande suivante : `git clone https://github.com/victorino-s/mercigustave-exercice.git`

- Naviguez dans chaque dossier présent et executez la commande suivante : `npm install`

- Lancez tout d'abord le 'backend' en vous rendant dans le dossier `mercigustave-exercice/backend` puis executez la commande `npm run dev`.

- Enfin, vous pouvez lancer les 2 applications clientes (`mercigustave-exercice/formulaire` et `mercigustave-exercice/dashboard`) en vous rendant dans leur dossier respectif et en executant la commande `npm start`

Un fichier 'config.js' est présent dans le dossier `mercigustave-exercice/backend` et contient notamment les credentials utilisés pour la base de données et pour l'adresse email utilisée par le serveur pour envoyer les notifications de commandes aux clients.

> Vous retrouverez dans ce fichier les adresses email et mots de passe utilisé pour les comptes gmail et mlab créés pour cet exercice.

# Améliorations

- Dans un contexte réel de production il vaudrait mieux séparer l'API en deux parties : une pour les administrateurs et une publique utilisée par les clients afin d'améliorer la sécurité et la charge du système.

- L'application Dashboard devrait posséder un système d'authentification.

- Le serveur devrait pouvoir notifier le dashboard afin d'afficher de façon dynamique les nouvelles commandes, sans avoir à rafraichir manuellement la page. Ceci notamment afin d'améliorer l'expérience utilisateur et de profiter pleinement du dynamisme offert par l'utilisation du JavaScript.
