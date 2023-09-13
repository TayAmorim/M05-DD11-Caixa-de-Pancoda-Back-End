const bcrypt = require('bcrypt');
const knex = require('../conection');
const loginSchema = require('../validations/loginSchema');
const jwt = require('jsonwebtoken');