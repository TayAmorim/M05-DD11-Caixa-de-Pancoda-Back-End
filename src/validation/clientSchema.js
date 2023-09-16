const joi = require("joi");

const clientSchema = joi.object({
  name_client: joi.string().required().messages({}),
  email_client: joi.string().email().required().messages({}),
  cpf_client: joi.string().required().max(11).messages({}),
  phone_client: joi.string().required().max(16).messages({}),
  cep: joi.string().required().max(8).messages({}),
  address: joi.string().required().messages({}),
  complement: joi.string().messages({}),
  neighborhood: joi.string().required().messages({}),
  city: joi.string().required().messages({}),
  state: joi.string().length(2).required().messages({}),
});

module.exports = clientSchema;
