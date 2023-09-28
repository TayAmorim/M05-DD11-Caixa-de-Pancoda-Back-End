const knex = require("../conection");

const filterByNameClient = () => async (req) => {
  const { name } = req.query;

  const charges = await knex("charges")
    .select("*")
    .where(
      knex.raw("lower(charges.name_client) ilike ?", [
        `%${name.toLowerCase()}%`,
      ])
    );

  return charges;
};

module.exports = {
  filterByNameClient,
};
