const knex = require("../conection");
const clientSchema = require("../validation/clientSchema");

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

const listingClientes = async (req, res) => {
  const { page } = req.query;
  const cutOff = 10;
  const currentPage = page || 1;

  try {
    offSet = (currentPage - 1) * cutOff;

    const clients = await knex('customers')
      .select('name_client', 'email_client', 'cpf_client', 'phone_client')
      .limit(cutOff)
      .offset(offSet);

    return res.json(clients);

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  newClient,
  listingClientes
};

