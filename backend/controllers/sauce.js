const Sauce = require('../models/sauce');
const fs = require('fs');

// Create Sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // Creation d'une nouvelle instance du modèle Sauce
    const sauce = new Sauce({
      ...sauceObject,
      // Génère url de l'image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: '',
      usersDisliked: ''
    });
    console.log(sauce.imageUrl);
    sauce.save()// Enregistre dans la db l'objet et renvoie une promesse
      .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};

// Modify Sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce), // Récupération de toutes les infos sur l'objet
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Delete Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


// Get specific Sauce (id)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id }) // Methode pour trouver une sauce unique
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Get all Sauces in database
exports.getAllSauces = (req, res, next) => {
    Sauce.find() // Methode renvoie un tableau contenant toutes les sauces dans la base de données
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

// Like Or Dislike 
// Un seul like ou dislike par user 
exports.likeOrNot = (req, res, next) => {
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Ajout Like' }))
          .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Ajout Dislike' }))
          .catch(error => res.status(400).json({ error }))
  } else {
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Suppression Like' }) })
                      .catch(error => res.status(400).json({ error }))
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Suppression Dislike' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error }))
  }
}