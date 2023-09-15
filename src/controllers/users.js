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
            return res.status(400).json({
            mensagem: 'Usuário não cadastrado'
        })
        }

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso'
        });
        
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }

}

module.exports = {
    registerUser
}
