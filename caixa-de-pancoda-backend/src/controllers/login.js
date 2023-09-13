const bcrypt = require('bcrypt');
const knex = require('../conection');
const loginSchema = require('../validations/loginSchema');
const jwt = require('jsonwebtoken');
const auth = require('../token/auth');

const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        await loginSchema.validate(req.body)

        const user = await knex("usuarios")
            .where({ email }).first();

        if (!user) {
            return res.status(400).json('Email e/ou senha não confere!');
        }
        const decryptedPassword = await bcrypt.compare(senha, user.senha)

        if (!decryptedPassword) {
            return res.status(400).json('Email e/ou senha não confere!');
        }
        const token = await jwt.sign({ id: user.id }, auth, { expiresIn: "3h" })

        const { senha: _, ...userData } = user
        userData.token = token

        res.status(200).json(userData)

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessages = error.errors;
            return res.status(400).json(errorMessages[0]);
        }
        console.error(error);
        return res.status(500).json('Erro interno no servidor!');
    }

}

module.exports = login