const knex = require('../conection');
const clientSchema = require('../validation/clientSchema');

const requiredField = ['nome', 'email', 'cpf', 'phone'];

const newClient = async (req, res) => {
    const { nome, email, cpf, phone, cep, address, complement, neighborhood, city, state } = req.body;
    const { id } = req.user;

    try {
        await clientSchema.validate(req.body);

        const existEmail = await knex('clients').where({ email });

        if (existEmail.length > 0) {
            return res.status(400).json({ mensagem: 'Email já cadastrado no sistema.' });
        }

        if (requiredField.some(field => !req.body[field])) {
            return res.status(400).json({ mensagem: 'Cliente não cadastrado, campo obrigatório' });
        }

        const client = await knex('clients').insert({
            id_usuario: id,
            nome,
            email,
            cpf,
            phone,
            cep,
            address,
            complement,
            neighborhood,
            city,
            state
        }).returning('*');

        if (client) {
            return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!' });
        }


    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessages = error.errors;
            console.log(errorMessages[0]);
            return res.status(400).json(errorMessages[0]);
        }
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
};


module.exports = { newClient };