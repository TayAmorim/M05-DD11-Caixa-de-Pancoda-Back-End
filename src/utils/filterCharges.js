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

  const { state, page } = req.query;
  const cutOff = 10;
  const currentPage = page || 1;
  const offset = (currentPage - 1) * cutOff;

  if (state === "paid") {
    charges = await knex("charges").where({ status: false });
  } else if (state === "preview") {
    charges = await knex("charges")
      .where({ status: true })
      .andWhere("due_date", ">=", currentDate);
  } else if (state === "overdue") {
    charges = await knex("charges")
      .where({ status: true })
      .andWhere("due_date", "<", currentDate);
  }
  charges = charges.slice(offset, offset + cutOff);
  const totalCount = charges.length;
  const totalPages = Math.ceil(totalCount / cutOff);
  return { charges, totalPages };
};

module.exports = {
  filterByNameClient,
  filterById,
  filterByStatus,
};
