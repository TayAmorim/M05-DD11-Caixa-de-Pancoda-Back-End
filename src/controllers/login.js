const bcrypt = require('bcrypt');
const knex = require('../conection');
const jwt = require('jsonwebtoken');

const hash = process.env.JWT_HASH;

const login = async (req, res) => {
    const { email, password } = req.body;

<<<<<<< HEAD
    if (!email || !password) {
        return res.status(404).json({
            mensagem: 'Informe o email e a senha para efetuar o login'
        });
    }

    try {
        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(404).json({
                mensagem: 'O usuario não foi encontrado'
            });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return res.status(400).json({
                mensagem: 'Email e senha não confere'
            });
        }

        const token = jwt.sign({ id: user.id }, hash, { expiresIn: '8h' });

        const { password: _, ...userData } = user;

        return res.status(200).json({
            user: userData,
            token
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
}

module.exports = { login } 
=======
    try {
        const user = await knex("usuarios").where({ email }).first();

        if (!user) {
            return res.status(400).json('O usuário não foi encontrado.');
        };

        const decryptedPassword = await bcrypt.compare(password, user.password);

        if (!decryptedPassword) {
            return res.status(400).json('O email e a senha não confere.');
        }
        const token = await jwt.sign({ id: user.id }, hash, { expiresIn: "8h" })

        const { password: _, ...userData } = user;

        return res.status(200).json({ user: userData, token });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

}

module.exports = login;
>>>>>>> developer
