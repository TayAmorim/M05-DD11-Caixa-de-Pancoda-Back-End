<<<<<<< HEAD
const jwt = require('jsonwebtoken');
const knex = require('../conection');
const hash = process.env.JWT_HASH;
=======
const knex = require('../conection');
const jwt = require('jsonwebtoken');
>>>>>>> developer

const loginFilter = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
<<<<<<< HEAD
        return res.status(401).json({
            mensagem: 'Não autorizado'
        });
    }

    const token = authorization.replace('Bearer ', '').trim();

    try {

        const { id } = jwt.verify(token, hash);

        const foundedUser = await knex('users').where({ id }).first();

        if (!foundedUser) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        const { password, ...user } = foundedUser;
=======
        return res.status(401).json({ mensagem: 'Não autorizado' });
    };

    const token = authorization.replace('Bearer', '').trim();

    try {
        const { id } = jwt.verify(token, hash);

        const userFounded = await knex('users').where({ id }).first();

        if (!userFounded) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado!' });
        };

        const { password, ...user } = userFounded;
>>>>>>> developer

        req.user = user;

        next();
    } catch (error) {
<<<<<<< HEAD
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
=======
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
>>>>>>> developer
    }
}

module.exports = loginFilter;