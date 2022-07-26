const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(500).json({ message: 'Le mot de passe doit faire 10 caractère au moins, avec une maj, une min et un chiffre au moins.' });
    } else {
        next();
    }
};