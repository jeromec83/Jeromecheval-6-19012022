//Imports
const express = require ('express');
const helmet = require('helmet');
const mongoose = require('mongoose'); // Facilite les interactions avec la db
const path = require('path');
const mongoSanitize = require ('express-mongo-sanitize');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const app = express(); // Création d'une application express

require('dotenv').config()  // Charge la variable d'environnement


// Connection de l'API au cluster de mongoDB
mongoose.connect('mongodb+srv://jercomec83:Mayfair83@cluster0.nc3mb.mongodb.net/piquante?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Securisation des en-têtes html
app.use(helmet());

 // Middleware appliqué à toutes les routes, permettant l'envoie de requête et d'accéder à l'API 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use(express.json());

// Pour éviter l'injection de code dans MongoDB
app.use(mongoSanitize());

// Pour la gestion des fichiers images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/auth', userRoutes); 
app.use('/api/sauces', sauceRoutes); // Enregistrement du routeur pour toutes les demandes effectuées vers /api/sauces

// Export
module.exports = app; // Donne l'accès depuis les autres fichiers, notamment le serveur Node