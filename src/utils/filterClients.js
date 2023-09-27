const knex = require("../conection");

const nameClient = (name) => async (req) => {
  const currentDate = new Date().toISOString();
  const { name } = req.query;
  let clientsFilter = [];

  if (name !== undefined) {
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
  }
};

module.exports = {
  nameClient,
};
