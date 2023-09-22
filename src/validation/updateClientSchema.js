const joi = require("joi");

const updateClientSchema = joi.object({
  name_client: joi.string().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome é obrigatório",
  }),
  email_client: joi.string().email().required().messages({
    "any.required": "O campo email é obrigatório",
    "string.empty": "O campo email é obrigatório",
    "string.email": "Email inválido",
  }),
  cpf_client: joi.string().required().min(11).messages({
    "any.required": "O campo cpf é obrigatório",
    "string.empty": "O campo cpf é obrigatório",
  }),
  phone_client: joi.string().required().min(16).messages({
    "any.required": "O campo telefone é obrigatório",
    "string.empty": "O campo telefone é obrigatório",
  }),
  cep: joi.string().allow("").min(8).messages({}),
  address: joi.string().allow("").messages({}),
  complement: joi.string().allow("").messages({}),
  neighborhood: joi.string().allow("").required().messages({}),
  city: joi.string().required().allow("").messages({}),
  state: joi.string().length(2).allow("").required().messages({}),
});

module.exports = updateClientSchema;