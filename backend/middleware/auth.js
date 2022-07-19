let jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.token = jwt.verify(token, process.env.SECRET_TOKEN);
    next();
  } catch (error) {
    res.status(401).json({message: `Invalid token ! ${ error }`});
  }
};


// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
//     const userId = decodedToken.userId;
//     req.auth = { userId };  
//     if (req.body.userId && req.body.userId !== userId) {
//       /*throw 'Invalid user ID';*/
//       res.status(403).json({ message: 'Requête non autorisée' });
//     } else {
//       next();
//     }
//   } catch {
//     res.status(401).json({
//       error: new Error('Invalid request!')
//     })
//   }
// };