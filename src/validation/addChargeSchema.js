const joi = require("joi");

const addChargeSchema = joi.object({
    id_customer: joi.string().required().messages({
        'any.required': 'O campo id do cliente é obrigatório.',
        'string.empty': 'O campo id do cliente não pode estar vazio.',
    }),
    name_client: joi.string().required().messages({
        'any.required': 'O campo nome do cliente é obrigatório.',
        'string.empty': 'O campo nome do cliente não pode estar vazio.',
    }),
    amount: joi.number().integer().min(0).required().messages({
        'any.required': 'O campo valor é obrigatório.',
        'number.base': 'O campo valor deve ser um número.',
        'number.integer': 'O campo valor deve ser um número inteiro.',
        'number.min': 'O campo valor deve ser maior ou igual a 0.',
    }),
    due_date: joi.string().required().messages({
        'any.required': 'O campo data de vencimento é obrigatório.',
        'date.base': 'O campo data de vencimento deve ser uma data válida no formato ISO.',
    }),
    registration_date: joi.date().iso().default(() => new Date()).messages({
        'date.base': 'O campo data de registro deve ser uma data válida no formato ISO.',
    }),
    description: joi.string().required().messages({
        'any.required': 'O campo descrição é obrigatório.',
        'string.empty': 'O campo descrição não pode estar vazio.',
    }),
    status: joi.boolean().required().messages({
        'any.required': 'O campo status é obrigatório.',
        'boolean.base': 'O campo status deve ser um valor booleano.',
    }),
});

module.exports = addChargeSchema;
