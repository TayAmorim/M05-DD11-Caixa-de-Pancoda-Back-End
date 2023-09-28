const knex = require("../conection");

const filterByNameClient = () => async (req) => {
  const { name_client } = req.query;

  const charges = await knex("charges")
    .select("*")
    .where(
      knex.raw("lower(charges.name_client) ilike ?", [
        `%${name_client.toLowerCase()}%`,
      ])
    );

  return charges;
};

const filterById = () => async (req) => {
  const { id_charges } = req.query;

  const chargesId = await knex("charges")
    .select("*")
    .where("charges.id_charges", id_charges);

  return chargesId;
};

const filterByStatus = () => async (req) => {
  const currentDate = new Date().toISOString();
  const { state } = req.query;

  if (state === "paid") {
    chargesStatus = await knex("charges").where({ status: false });
  } else if (state === "preview") {
    chargesStatus = await knex("charges")
      .where({ status: true })
      .andWhere("due_date", ">=", currentDate);
  } else if (state === "overdue") {
    chargesStatus = await knex("charges")
      .where({ status: true })
      .andWhere("due_date", "<", currentDate);
  }
  return chargesStatus;
};

module.exports = {
  filterByNameClient,
  filterById,
  filterByStatus,
};
