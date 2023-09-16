const joi = require("joi");

const clientSchema = joi.object({
    nome: joi.string().required().messages({
        "any.required": "O campo nome é obrigatório",
        "string.empty": "O campo nome é obrigatório",
    }),
    email: joi.string().email().required().messages({
        "any.required": "O campo nome é obrigatório",
        "string.empty": "O campo nome é obrigatório",
    }),
    cpf: joi.string().required().max(11).messages({
        "any.required": "O campo nome é obrigatório",
        "string.empty": "O campo nome é obrigatório",
    }),
    phone: joi.string().required().max(16).messages({
        "any.required": "O campo nome é obrigatório",
        "string.empty": "O campo nome é obrigatório",
    }),
    cep: joi.string().required().max(8).messages({}),
    address: joi.string().required().messages({}),
    complement: joi.string().messages({}),
    neighborhood: joi.string().required().messages({}),
    city: joi.string().required().messages({}),
    state: joi.string().length(2).required().messages({})
})

module.exports = clientSchema;

