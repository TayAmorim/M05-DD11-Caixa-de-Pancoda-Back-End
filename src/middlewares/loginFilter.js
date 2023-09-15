const knex = require('../conection');
const jwt = require('jsonwebtoken');

const loginFilter = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
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

        req.user = user;

        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

module.exports = loginFilter;