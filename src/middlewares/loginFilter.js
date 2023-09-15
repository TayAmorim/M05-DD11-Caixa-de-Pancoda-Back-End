const jwt = require('jsonwebtoken');
const knex = require('../conection');
const hash = process.env.JWT_HASH;

const loginFilter = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            mensagem: 'Não autorizado'
        });
    }

    const token = authorization.replace('Bearer ', '').trim();

    try {

        const { id } = jwt.verify(token, hash);

        const foundedUser = await knex('usuarios').where({ id }).first();

        if (!foundedUser) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        const { password, ...user } = foundedUser;

        req.user = user;

        next();
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
}

module.exports = loginFilter;