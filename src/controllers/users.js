const knex = require('../conection');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userFounded = await knex('users').where({ email }).first();

        if (userFounded) {
            return res.status(400).json({
                mensagem: "Email já cadastrado"
            });
        }

        const encryptedPass = await bcrypt.hash(password, 10);

        const user = await knex('users')
            .insert({
                name,
                email,
                password: encryptedPass
            }).returning('*');

        if (!user) {
            return res.status(400).json("Usuário não cadastrado.")
        }

        const { password: _, ...registeredUser
        } = user[0];

        return res.status(201).json(registeredUser);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }

}

module.exports = {
    registerUser
}