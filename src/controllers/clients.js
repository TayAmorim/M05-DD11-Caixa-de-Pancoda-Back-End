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
      return res.status(400).json({ mensagem: 'Cliente não encontrado' });
    }

    if (registeredEmail.length > 0 && email_client !== findClient[0].email_client) {
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
      return res
        .status(400)
        .json({ mensagem: "Cliente não cadastrado, campo obrigatório em branco." });
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
      .returning('*');

    if (updateClient) {
      return res.status(200).json(updateClient[0]);
    }

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessages = error.errors;
      console.log(errorMessages[0]);
      return res.status(400).json(errorMessages[0]);
    }
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}


module.exports = {
  newClient,
  updateClient
};
