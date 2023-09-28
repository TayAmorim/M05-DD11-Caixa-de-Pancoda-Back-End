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

module.exports = {
  filterByNameClient,
  filterById,
};
