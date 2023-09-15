const joi = require('joi');

const loginSchema = joi.object()({
    email: joi.string().required(),
    password: joi.string().required(),
});

module.exports = loginSchema;