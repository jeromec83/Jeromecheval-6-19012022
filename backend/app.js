const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/user');

// Connection de l'API au cluster de mongoDB
mongoose.connect('mongodb+srv://jercomec83:Mayfair83@cluster0.nc3mb.mongodb.net/piquante?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware appliqué à toutes les routes, permettant l'envoie de requête et d'accéder à l'API 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use(express.json());
app.use(bodyParser.json());

app.use('/api/auth', userRoutes); 


module.exports = app; // Donne l'accès depuis les autres fichiers, notamment le serveur Node