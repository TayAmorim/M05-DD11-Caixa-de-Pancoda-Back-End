const knex = require("../conection");
const clientSchema = require("../validation/clientSchema");
const updateClientSchema = require("../validation/updateClientSchema");

const requiredField = [
  "name_client",
  "email_client",
  "cpf_client",
  "phone_client",
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

const updateClient = async (req, res) => {
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
  const { identification } = req.params;

  try {
    await updateClientSchema.validate(req.body);

    const findClient = await knex("customers").where({ id: identification });
    const registeredEmail = await knex("customers").where({ email_client });
    const registeredCpf = await knex("customers").where({ cpf_client });

    if (findClient.length === 0) {
      return res.status(400).json({ mensagem: "Cliente não encontrado" });
    }

    if (
      registeredEmail.length > 0 &&
      email_client !== findClient[0].email_client
    ) {
      return res
        .status(400)
        .json({ mensagem: "Email já cadastrado no sistema." });
    }

    if (registeredCpf.length > 0 && cpf_client !== findClient[0].cpf_client) {
      return res
        .status(400)
        .json({ mensagem: "CPF já cadastrado no sistema." });
    }

    if (requiredField.some((field) => !req.body[field])) {
      return res.status(400).json({
        mensagem: "Cliente não cadastrado, campo obrigatório em branco.",
      });
    }

    const updateClient = await knex("customers")
      .where({ id: identification })
      .update({
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

    if (updateClient) {
      return res.status(200).json(updateClient[0]);
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
    const currentDate = new Date().toISOString();
    const totalClients = await knex("customers").count("* as total").first();
    const totalPages = Math.ceil(totalClients.total / cutOff);

    const clientsWithStatus = await knex("customers")
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
      .orderBy("customers.id", "desc")
      .limit(cutOff)
      .offset(offSet);

    res.json({ clientsWithStatus, totalPages });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro interno do servidor",
      detalhes: error.message,
    });
  }
};

const detailClient = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await knex("customers")
      .select(
        "customers.name_client",
        "customers.email_client",
        "customers.cpf_client",
        "customers.phone_client",
        "customers.address",
        "customers.neighborhood",
        "customers.complement",
        "customers.cep",
        "customers.city",
        "customers.state",
        "charges.id_charges",
        "charges.description",
        "charges.due_date",
        "charges.amount",
        "charges.status"
      )
      .leftJoin("charges", "customers.id", "charges.id_customer")
      .where("customers.id", id);

    if (data.length === 0) {
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    }

    const clientData = data[0];

    const client = {
      name_client: clientData.name_client,
      cpf_client: clientData.cpf_client,
      email_client: clientData.email_client,
      phone_client: clientData.phone_client,
      address_complete: {
        address: clientData.address,
        cep: clientData.cep,
        complement: clientData.complement,
        neighborhood: clientData.neighborhood,
        city: clientData.city,
        state: clientData.state,
      },
      charges: data
        .filter((row) => row.id_charges !== null)
        .map((row) => ({
          id_charges: row.id_charges,
          description: row.description,
          due_date: row.due_date,
          amount: row.amount,
          status: row.status,
        })),
    };

    return res.json(client);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  newClient,
  listingClients,
  detailClient,
  updateClient,
};
