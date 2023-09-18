const joi = require("joi");

const updateSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome é obrigatório",
  }),
  email: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório",
    "string.empty": "O campo email é obrigatório",
    "string.email": "Email inválido",
  }),
  password: joi.string().messages({}),
  phone: joi.string().messages({}),
  cpf: joi.string().max(12).messages({}),
});

module.exports = updateSchema;
