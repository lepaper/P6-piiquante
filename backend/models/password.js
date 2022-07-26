const pwdValidator = require('password-validator');

const passwordSchema = new pwdValidator();

passwordSchema
.is().min(10)                                    
.is().max(50)                                  
.has().uppercase(1)                              
.has().lowercase(1)                             
.has().digits(1)                                
.has().not().spaces()                    

module.exports = passwordSchema;