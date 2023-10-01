const { exist } = require("joi");
const knex = require("../conection");
const {
  filterByNameClient,
  filterById,
  filterByStatus,
} = require("../utils/filterCharges");
const addChargeSchema = require("../validation/addChargeSchema");
const updateChargeSchema = require("../validation/updateChargeSchema");

const requiredField = [
  "id_customer",
  "name_client",
  "description",
  "status",
  "amount",
  "due_date",
];

const newCharge = async (req, res) => {
  const { id_customer, name_client, amount, due_date, description, status } =
    req.body;

  try {
    await addChargeSchema.validate(req.body);

    const findClient = await knex("customers").where("id", id_customer);

    if (findClient.length === 0) {
      return res.status(400).json({ mensagem: "Cliente não encontrado" });
    }

    if (requiredField.some((field) => !req.body.hasOwnProperty(field))) {
      return res
        .status(400)
        .json({ mensagem: "Cobrança não cadastrada, campo obrigatório" });
    }

    const charge = await knex("charges")
      .insert({
        id_customer,
        name_client,
        amount,
        due_date,
        description,
        status,
      })
      .returning("*");

    if (!charge || charge.length === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível cadastrar a cobrança" });
    }

    res.status(201).json(charge[0]);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = error.errors;
      console.log(errorMessages[0]);
      return res.status(400).json(errorMessages[0]);
    }
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listingCharges = async (req, res) => {
  try {
    const { page, name_client, id_charges, state } = req.query;
    const cutOff = 10;
    const currentPage = page || 1;
    const offSet = (currentPage - 1) * cutOff;

    if (name_client !== undefined) {
      const filterByName = await filterByNameClient(name_client)(req);
      return res.json(filterByName);
    }

    if (id_charges !== undefined) {
      const idCharge = await filterById(id_charges)(req);
      return res.json(idCharge);
    }

    if (state !== undefined && page !== undefined) {
      const status = await filterByStatus(state, page)(req);
      return res.json(status);
    }

    const [charges, totalCharges] = await Promise.all([
      knex("charges").select("*").limit(cutOff).offset(offSet),
      knex("charges").count("* as total").first(),
    ]);

    const totalPages = Math.ceil(totalCharges.total / cutOff);

    res.json({ charges, totalPages });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro interno do servidor",
      detalhes: error.message,
    });
  }
};

const updateCharge = async (req, res) => {
  const { id_charges, description, status, amount, due_date } = req.body;

  try {
    await updateChargeSchema.validate(req.body);

    const existCharge = await knex("charges").where({ id_charges }).first();

    if (!existCharge) {
      return res.status(404).json({ mensagem: "Cobrança não encontrada" });
    }

    const updateCharge = await knex("charges")
      .where({ id_charges })
      .update({
        description,
        status,
        amount,
        due_date,
      })
      .returning("*");

    if (updateCharge) {
      return res.status(200).json(updateCharge[0]);
    }
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const deleteCharge = async (req, res) => {
  const { identification } = req.params;

  try {
    const findCharge = await knex("charges")
      .where("id_charges", identification)
      .returning("*");

    if (findCharge.length === 0) {
      return res.status(400).json("Cobrança não encontrada");
    }

    const deletedCharge = await knex("charges")
      .where("id_charges", identification)
      .delete()
      .returning("*");

    if (!deletedCharge || deleteCharge.length === 0) {
      return res.status(400).json("Cobrança não excluida");
    }

    return res.status(200).json("Cobrança excluída com sucesso");
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = error.errors;
      console.log(errorMessages[0]);
      return res.status(400).json(errorMessages[0]);
    }
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detailCharge = async (req, res) => {
  const { id } = req.params;

  try {
    const dataCharge = await knex("charges")
      .select(
        "name_client",
        "description",
        "due_date",
        "amount",
        "id_charges",
        "status"
      )
      .where("id_charges", id);

    if (dataCharge.length === 0) {
      return res.status(404).json({
        mensagem: "Cobrança não encontrada",
      });
    }

    return res.json(dataCharge);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  newCharge,
  listingCharges,
  updateCharge,
  deleteCharge,
  detailCharge,
};
