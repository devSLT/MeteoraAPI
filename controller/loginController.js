require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const saltsRounds = 10;

const hello = (req, res) => {
    res.status(200).json('Hello World')
}

const newAcount = async (req, res) => {

    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({ message: `Preencha o e-mail corretamente` })
    }
    if (!password) {
        return res.status(400).json({ message: `Preencha o campo de senha corretamente` })
    }


    try {

        const hash = await bcrypt.hash(password, saltsRounds);
        console.log("Senha criptografada: " + hash)

        const user = new User({
            email: email,
            password: hash,
        })

        let docs = await User.findOne({ email });

        if (docs == null) {
            user.save()
                .then(() => console.log(`User salvo com sucesso`))
                .catch((err) => console.log(`Houve um erro ao salvar o user: ${err}`))
            res.status(201).json({ message: `Conta criada com sucesso`, sucess:true });
        } else {
            res.status(409).json({ message: "Esse email ja está sendo usado", sucess: false })
            console.log(docs)
        }
    } catch (err) {
        res.status(500).json({ message: `Houve um erro ao acessar docs: ${err}`, sucess:false })
    }
}

const login = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: `e-mail e senha são obrigatórios` })
    }

    try {
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(422).json({ message: "Email inválido", sucess: false, })
        }

        const userPassSaved = userExist.password;

        const isMatch = await bcrypt.compare(password, userPassSaved);

        if (!isMatch) {
            return res.status(401).json({
                message: "Insira uma senha válida", sucess: false,
            })
        }

        const userId = userExist._id

        return res.status(200).json({ message: `Login realizado com sucesso`, sucess: true, userId });

    } catch (error) {
        res.status(500).json({ message: `Ocorreu um erro no servidor, tente novamente mais tarde` })
        console.log("Ocorreu um erro: " + error)
    }

}



module.exports = { newAcount, login, hello, };