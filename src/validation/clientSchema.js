const joi = require("joi");

const clientSchema = joi.object({
  name_client: joi.string().required().messages({}),
  email_client: joi.string().email().required().messages({}),
  cpf_client: joi.string().required().length(11).messages({}),
  phone_client: joi.string().required().length(14).messages({}),
  cep: joi.string().allow("").length(8).messages({}),
  address: joi.string().allow("").messages({}),
  complement: joi.string().allow("").messages({}),
  neighborhood: joi.string().allow("").messages({}),
  city: joi.string().allow("").messages({}),
  state: joi.string().length(2).allow("").messages({})
});

module.exports = clientSchema;
