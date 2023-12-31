const express = require("express");
const validateRequest = require("./middlewares/validateRequest");
const userSchema = require("./validation/userSchema");
const { registerUser, updateUser, getUser } = require("./controllers/users");

const { login } = require("./controllers/login");
const loginFilter = require("./middlewares/loginFilter");
const loginSchema = require("./validation/loginSchema");

const {
  newClient,
  listingClients,
  detailClient,
} = require("./controllers/clients");
const clientSchema = require("./validation/clientSchema");
const updateUserSchema = require("./validation/updateUserSchema");

const { updateClient } = require("./controllers/clients");
const updateClientSchema = require("./validation/updateClientSchema");
const updateChargeSchema = require("./validation/updateChargeSchema");
const {
  newCharge,
  listingCharges,
  updateCharge,
  deleteCharge,
  detailCharge,
} = require("./controllers/charges");
const addChargeSchema = require("./validation/addChargeSchema");
const customReport = require("./controllers/custom");

const routes = express();

routes.post("/users", validateRequest(userSchema), registerUser);
routes.post("/login", validateRequest(loginSchema), login);
routes.get("/user/:id", getUser);

routes.use(loginFilter);

routes.post("/clients", validateRequest(clientSchema), newClient);

routes.put("/updateuser", validateRequest(updateUserSchema), updateUser);
routes.put(
  "/clients/:identification",
  validateRequest(updateClientSchema),
  updateClient
);
routes.get("/listclients", listingClients);
routes.get("/detailclient/:id", detailClient);
routes.get("/listcharges", listingCharges);
routes.put("/updatecharge", validateRequest(updateChargeSchema), updateCharge);
routes.get("/customReport", customReport);
routes.get("/detailcharge/:id", detailCharge)
routes.post("/charges", validateRequest(addChargeSchema), newCharge);

routes.delete("/charges/:identification", deleteCharge);

module.exports = routes;
