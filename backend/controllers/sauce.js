
const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
  userId: req.token.userId,
  likes: 0,
  dislikes: 0,
  usersLiked: [' '],
  usersDisliked: [' '],
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
   .then(sauce => res.status(200).json(sauce))
   .catch(error => res.status(404).json({error}));
    
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
  .then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    if(sauce.userId == req.token.userId){
      if(req.file) {
           
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if(err) throw err;
                });
      }
            
          const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body }

  Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
  .then(res.status(200).json({ message: "Sauce modifiée"}))
  .catch(error => res.status(400).json({ error }))
  }else{
    res.status(401).json({message: "requéte non autorisée"})
  }
  })
  .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if(sauce.userId == req.token.userId){
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        })
      }else{
        res.status(401).json({message: "requéte non autorisée"})
      }
    })    
    .catch(error => res.status(500).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.token.userId
  let sauceId = req.params.id
  Sauce.findOne({ _id: sauceId })
  .then(sauce => {
    switch (like) {
      case 1 :
        if(!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)){
          sauce.usersLiked.push(userId)
        }
          // Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          //   .then(() => res.status(200).json({ message: `J'aime` }))
          //   .catch((error) => res.status(400).json({ error }))
              
        break;

      case 0 :
        if(sauce.usersLiked.includes(userId)){
          sauce.usersLiked = sauce.usersLiked.filter(item => item != userId)
        }
        if( sauce.usersDisliked.includes(userId)){
          sauce.usersDisliked = sauce.usersDisliked.filter(item => item != userId)
        }

              // Sauce.findOne({ _id: sauceId })
              //   .then((sauce) => {
              //     if (sauce.usersLiked.includes(userId)) { 
              //       Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
              //         .then(() => res.status(200).json({ message: `Neutre` }))
              //         .catch((error) => res.status(400).json({ error }))
              //     }
              //     if (sauce.usersDisliked.includes(userId)) { 
              //       Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
              //         .then(() => res.status(200).json({ message: `Neutre` }))
              //         .catch((error) => res.status(400).json({ error }))
              //     }
              //   })
              //   .catch((error) => res.status(404).json({ error }))
          break;

      case -1 :
        if(!sauce.usersDisliked.includes(userId) && !sauce.usersLiked.includes(userId)){
          sauce.usersDisliked.push(userId)
        }
          // Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          //   .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          //   .catch((error) => res.status(400).json({ error }))
        break;
        
        default:
          res.status(400).json({ message : 'Bad request'});
    }
    sauce.likes = sauce.usersLiked.lenght;
    sauce.dislikes = sauce.usersDisliked.lenght;
console.log(sauce.usersLiked.lenght);
    sauce.save()
    .then(mysauce => res.status(200).json({ message: "Sauce notée"}))
    .catch(error => res.status(404).json({ error }))
  })
  .catch(error => res.status(400).json({ error }));
};

