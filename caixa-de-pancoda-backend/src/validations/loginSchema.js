const yup = require('./yup');

const loginSchema = yup.object().shape({
    email: yup.string().email().required().trim(),
    senha: yup.string().required().trim().min(6)
})

module.exports = loginSchema