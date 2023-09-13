const express = require('express');
const routes = express();

const login = require('../controllers/login');


routes.post('/login', login);


module.exports = routes;
