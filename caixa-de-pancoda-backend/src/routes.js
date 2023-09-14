const express = require('express');
const validateRequest = require('./middlewares/validateRequest');
const userSchema = require('./validations/userSchema');
const { registerUser } = require('./controllers/users');
const login = require('./controllers/login');
const loginFilter = require('./middlewares/loginFilter');

const routes = express();

routes.post('/users', validateRequest(userSchema), registerUser);
routes.post('/login', login);

routes.use(loginFilter);


module.exports = routes;
