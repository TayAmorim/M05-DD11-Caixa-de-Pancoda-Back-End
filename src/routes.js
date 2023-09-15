const express = require("express");
const validateRequest = require("./middlewares/validateRequest");
const userSchema = require("./validation/userSchema");
const { registerUser, updateUser } = require("./controllers/users");

const { login } = require("./controllers/login");
const loginFilter = require("./middlewares/loginFilter");
const loginSchema = require("./validation/loginSchema");

const routes = express();

routes.post("/users", validateRequest(userSchema), registerUser);
routes.post("/login", validateRequest(loginSchema), login);

routes.use(loginFilter);

routes.put("/updateuser", validateRequest(userSchema), updateUser);

module.exports = routes;
