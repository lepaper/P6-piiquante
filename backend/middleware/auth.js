let jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.token = jwt.verify(token, process.env.SECRET_TOKEN);
    next();
  } catch (error) {
    res.status(500).json({message: `Invalid token ! ${ error }`});
  }
};