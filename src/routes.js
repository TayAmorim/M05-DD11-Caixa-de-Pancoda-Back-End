const express = require("express");
const validateRequest = require("./middlewares/validateRequest");
const userSchema = require("./validation/userSchema");
const { registerUser, updateUser, getUser } = require("./controllers/users");

const { login } = require("./controllers/login");
const loginFilter = require("./middlewares/loginFilter");
const loginSchema = require("./validation/loginSchema");

const { newClient } = require("./controllers/clients");
const clientSchema = require("./validation/clientSchema");
const updateSchema = require("./validation/updateSchema");

const routes = express();

routes.post("/users", validateRequest(userSchema), registerUser);
routes.post("/login", validateRequest(loginSchema), login);
routes.get("/user/:id", getUser);

routes.use(loginFilter);

routes.post("/clients", validateRequest(clientSchema), newClient);

routes.put("/updateuser", validateRequest(updateSchema), updateUser);

module.exports = routes;
