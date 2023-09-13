const joi = require('joi')

const userSchema = joi.object({
    name: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório'
    }),
    email: joi.string().email().required().messages({
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório',
        'string.email': 'Email inválido'
    }),
    password: joi.string().required().messages({
        'any.required': 'O campo senha é obrigatório',
        'string.empty': 'O campo senha é obrigatório',
    })
})

module.exports = userSchema;