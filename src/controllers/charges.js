const knex = require("../conection");
const addChargeSchema = require("../validation/addChargeSchema");

const requiredField = [
    "name_client",
    "description",
    "status",
    "amount",
    "due_date"
];

const newCharge = async (req, res) => {
    const { name_client, amount, due_date, registration_date, description, status } = req.body;
    const { identification } = req.params;
    const { id } = req.user;

    try {
        await addChargeSchema.validate(req.body);

        const findClient = await knex("customers").where({ id });

        if (findClient.length === 0) {
            return res.status(400).json({ mensagem: "Cliente não encontrado" });
        }

        if (requiredField.some((field) => !req.body[field])) {
            return res.status(400).json({ mensagem: "Cobrança não cadastrada, campo obrigatório" });
        }

        const charge = await knex("charges").insert({
            id_charges: identification,
            id_customer: id,
            name_client,
            amount,
            due_date,
            registration_date,
            description,
            status,
        }).returning('*');

        if (!charge || charge.length === 0) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a cobrança" });
        }

        res.status(201).json({ mensagem: "Cobrança cadastrada com sucesso!" });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errorMessages = error.errors;
            console.log(errorMessages[0]);
            return res.status(400).json(errorMessages[0]);
        }
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = { newCharge };