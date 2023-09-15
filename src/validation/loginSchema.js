const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome é obrigatório",
    "string.email": "Email inválido",
  }),
  password: joi.string().required().messages({
    "any.required": "O campo senha é obrigatório",
    "string.empty": "O campo senha é obrigatório",
  }),
  phone: joi.string().message({}),
  cpf: joi.string.max(12).message({}),
});

module.exports = loginSchema;
