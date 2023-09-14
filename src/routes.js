const express = require("express");
const validateRequest = require('./middlewares/validateRequest');
const userSchema = require('./validation/userSchema');
const { registerUser } = require('./controllers/users');

const routes = express()

routes.post('/users', validateRequest(userSchema), registerUser);

module.exports = routes;