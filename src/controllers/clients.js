const knex = require("../conection");
const clientSchema = require("../validation/clientSchema");

const requiredField = [
  "name_client",
  "email_client",
  "cpf_client",
  "phone_client"
];

const newClient = async (req, res) => {
  const {
    name_client,
    email_client,
    cpf_client,
    phone_client,
    cep,
    address,
    complement,
    neighborhood,
    city,
    state,
  } = req.body;
  const { id } = req.user;

  try {
    await clientSchema.validate(req.body);

    const existEmail = await knex("customers").where({ email_client });

    if (existEmail.length > 0) {
      return res
        .status(400)
        .json({ mensagem: "Email já cadastrado no sistema." });
    }

    if (requiredField.some((field) => !req.body[field])) {
      return res
        .status(400)
        .json({ mensagem: "Cliente não cadastrado, campo obrigatório" });
    }

    const client = await knex("customers")
      .insert({
        id_user: id,
        name_client,
        email_client,
        cpf_client,
        phone_client,
        cep,
        address,
        complement,
        neighborhood,
        city,
        state,
      })
      .returning("*");
    if (client) {
      return res
        .status(201)
        .json({ mensagem: "Cadastro realizado com sucesso!" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = error.errors;
      console.log(errorMessages[0]);
      return res.status(400).json(errorMessages[0]);
    }
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listingClients = async (req, res) => {
  try {
    const { page } = req.query;
    const cutOff = 10;
    const currentPage = page || 1;
    const offSet = (currentPage - 1) * cutOff;
    const currentDate = new Date();
    const totalClients = await knex('customers').count('* as total').first();
    const totalPages = Math.ceil(totalClients.total / cutOff);

    const clients = await knex("customers")
      .select("id", "name_client", "email_client", "cpf_client", "phone_client")
      .limit(cutOff)
      .offset(offSet);

    const clientPromises = clients.map(async (client) => {
      const chargeCount = await knex("charges")
        .count("id_charges")
        .where("status", true)
        .where("due_date", "<", currentDate)
        .where("id_customer", client.id);

      const hasCharges = chargeCount[0].count > 0;
      return { ...client, status: hasCharges };
    });

    const clientsWithStatus = await Promise.all(clientPromises);

    res.json({ clientsWithStatus, totalPages });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro interno do servidor",
      detalhes: error.message,
    });
  }
};

module.exports = {
  newClient,
  listingClients
};
