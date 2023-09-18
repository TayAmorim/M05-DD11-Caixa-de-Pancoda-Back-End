const knex = require("../conection");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userFounded = await knex("users").where({ email }).first();

    if (userFounded) {
      return res.status(400).json({
        mensagem: "Email já cadastrado",
      });
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const user = await knex("users")
      .insert({
        name,
        email,
        password: encryptedPass,
      })
      .returning("*");

    if (!user) {
      return res.status(400).json({
        mensagem: "Usuário não cadastrado",
      });
    }

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userFounded = await knex("users").where({ id }).first();

    if (!userFounded) {
      return res.status(404).json({
        mensagem: "Usuario não encontrado",
      });
    }
    const { password: _, ...userData } = userFounded;
    return res.json(userData);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
};

const updateUser = async (req, res) => {
  const { name, email, password, cpf, phone } = req.body;
  const { id } = req.user;
  let encryptedPass;

  try {
    const userFounded = await knex("users").where({ id }).first();

    if (!userFounded) {
      return res.status(404).json({
        mensagem: "Usuario não encontrado",
      });
    }
    if (password) {
      encryptedPass = await bcrypt.hash(password, 10);
    } else {
      encryptedPass = password;
    }

    if (email !== req.user.email) {
      const emailUserFounded = await knex("users").where({ email }).first();

      if (emailUserFounded) {
        return res.status(400).json({
          mensagem: "O Email já está cadastrado.",
        });
      }
    }

    await knex("users").where({ id }).update({
      name,
      email,
      password: encryptedPass,
      cpf,
      phone,
    });

    return res.status(204).send({ mensagem: "Usuário atualizado com Sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
};

module.exports = {
  registerUser,
  updateUser,
  getUser,
};
