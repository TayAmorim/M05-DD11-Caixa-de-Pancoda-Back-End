const knex = require("../conection");

const filterByName = () => async (req) => {
  const currentDate = new Date().toISOString();
  const { name } = req.query;
  let clientsFilter = [];

  const clients = await knex("customers")
    .select(
      "customers.id",
      "customers.name_client",
      "customers.email_client",
      "customers.cpf_client",
      "customers.phone_client",
      knex.raw(
        "COUNT(CASE WHEN charges.id_charges IS NOT NULL THEN 1 ELSE NULL END) > 0 as status"
      )
    )
    .leftJoin("charges", function () {
      this.on("charges.id_customer", "=", "customers.id")
        .andOn(knex.raw("charges.status = ?", [true]))
        .andOn(knex.raw("charges.due_date < ?", [currentDate]));
    })
    .where(
      knex.raw("lower(customers.name_client) ilike ?", [
        `%${name.toLowerCase()}%`,
      ])
    )
    .groupBy("customers.id")
    .orderBy("customers.id", "desc");
  clientsFilter = clients;
  return clientsFilter;
};

const filterByCPF = () => async (req) => {
  const currentDate = new Date().toISOString();
  const { cpf } = req.query;
  let clientsCpf = [];

  const clients = await knex("customers")
    .select(
      "customers.id",
      "customers.name_client",
      "customers.email_client",
      "customers.cpf_client",
      "customers.phone_client",
      knex.raw(
        "COUNT(CASE WHEN charges.id_charges IS NOT NULL THEN 1 ELSE NULL END) > 0 as status"
      )
    )
    .leftJoin("charges", function () {
      this.on("charges.id_customer", "=", "customers.id")
        .andOn(knex.raw("charges.status = ?", [true]))
        .andOn(knex.raw("charges.due_date < ?", [currentDate]));
    })
    .where(knex.raw("lower(customers.cpf_client) ilike ?", [`%${cpf}%`]))
    .groupBy("customers.id")
    .orderBy("customers.id", "desc");
  clientsCpf = clients;
  return clientsCpf;
};

const filterByEmail = () => async (req) => {
  const currentDate = new Date().toISOString();
  const { email } = req.query;
  const clientsCpf = await knex("customers")
    .select(
      "customers.id",
      "customers.name_client",
      "customers.email_client",
      "customers.cpf_client",
      "customers.phone_client",
      knex.raw(
        "COUNT(CASE WHEN charges.id_charges IS NOT NULL THEN 1 ELSE NULL END) > 0 as status"
      )
    )
    .leftJoin("charges", function () {
      this.on("charges.id_customer", "=", "customers.id")
        .andOn(knex.raw("charges.status = ?", [true]))
        .andOn(knex.raw("charges.due_date < ?", [currentDate]));
    })
    .where(knex.raw("lower(customers.email_client) ilike ?", [`%${email}%`]))
    .groupBy("customers.id")
    .orderBy("customers.id", "desc");

  return clientsCpf;
};

const filterByStatus = (campo) => async (req) => {
  const { status } = req.query;
  const currentDate = new Date().toISOString();
  let clientsFilter = [];
  const clientsStatus = await knex("customers")
    .select(
      "customers.id",
      "customers.name_client",
      "customers.email_client",
      "customers.cpf_client",
      "customers.phone_client",
      knex.raw(
        "COUNT(CASE WHEN charges.id_charges IS NOT NULL THEN 1 ELSE NULL END) > 0 as status"
      )
    )
    .leftJoin("charges", function () {
      this.on("charges.id_customer", "=", "customers.id")
        .andOn(knex.raw("charges.status = ?", [true]))
        .andOn(knex.raw("charges.due_date < ?", [currentDate]));
    })
    .groupBy("customers.id")
    .orderBy("customers.id", "desc");

  clientsFilter = clientsStatus.filter((client) => {
    if (status === "true") {
      return client.status === true;
    }
    if (status === "false") {
      return client.status === false;
    }
  });
  return clientsFilter;
};

module.exports = {
  filterByName,
  filterByCPF,
  filterByEmail,
  filterByStatus,
};
