const joi = require("joi");

const clientSchema = joi.object({
  name_client: joi.string().required().messages({}),
  email_client: joi.string().email().required().messages({}),
  cpf_client: joi.string().required().max(11).messages({}),
  phone_client: joi.string().required().max(16).messages({}),
  cep: joi.string().allow("").max(8).messages({}),
  address: joi.string().allow("").messages({}),
  complement: joi.string().allow("").messages({}),
  neighborhood: joi.string().allow("").required().messages({}),
  city: joi.string().required().allow("").messages({}),
  state: joi.string().length(2).allow("").required().messages({}),
});

module.exports = clientSchema;
