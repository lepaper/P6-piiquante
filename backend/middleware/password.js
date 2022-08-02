const pwdValidator = require("password-validator");

const passwordSchema = new pwdValidator();

passwordSchema
.is().min(10)                                    
.is().max(50)                                  
.has().uppercase(1)                              
.has().lowercase(1)                             
.has().digits(1)                                
.has().not().spaces()                    

//module.exports = passwordSchema;
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(500).json({ message: 'Le mot de passe doit faire 10 caractère au moins, avec une maj, une min et un chiffre au moins.' });
    } else {
        next();
    }
};
