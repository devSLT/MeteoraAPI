require('dotenv').config();
const User = require('../models/User');
const Stock = require('../models/Stock');
const { search } = require('../routes/siteManager');

const stockManager = {

    uploadStock: async (req, res) => {

        const { title, desc, link, price, stockQTD } = req.body;

        if (!title || !desc || !link || !price || !stockQTD) {
            return res.status(400).json({ message: "Preencha corretamente todos os campos", sucess: false })
        }

        try {

            const stock = new Stock({
                title,
                desc,
                link,
                price,
                stockQTD,
            });

            stock.save()
                .then(() => {
                    console.log('salvo com sucesso')
                    console.log(stock)
                })
                .catch((err) => console.log(`Houve um erro ao salvar o stock: ${err}`))

            return res.status(201).json({ message: "Salvo com sucesso" })

        } catch (error) {

        }

    },

    loadInfos: async (req, res) => {
        try {
            const imagens = await Stock.find()
            res.status(200).json({ message: "Enviado com sucesso", dados: imagens });

        } catch (error) {
            res.status(400).json({ message: "Houve um erro " + error })
        }
    },

    getInfos: async (req, res) => {

        const { idImage } = req.body;

        if (!idImage) {
            return res.status(500).json({ message: "Estamos com problemas no servidor, tente novamente mais tarde.", sucess: false })
        }

        try {

            const searchImage = await Stock.findById(idImage);

            if (!searchImage) {
                return res.status(404).json({ message: "Imagem não encontrada", sucess: false })
            }


            res.status(200).json({ message: "Imagem enviada", dados: searchImage, sucess: true })
            return

        } catch (error) {
            console.log("Houve um erro no servidor: " + error)
            res.status(500).json({ message: "Houve um erro, tente novamente mais tarde", sucess: false })
            return
        }

    },

    buyItem: async (req, res) => {

        const { idImage, userId, amount } = req.body;

        if (!idImage) {
            return res.status(500).json({ message: "Estamos com problemas no servidor, tente novamente mais tarde.", sucess: false });
        }

        if (!amount || amount <= 0) {
            return res.status(401).json({ message: "Insira uma quantidade válida de produtos", sucess: false });
        }


        if (!userId) {
            return res.status(401).json({ message: "Faça Login para continuar", sucess: false });
        }

        try {

            const verifyUser = await User.findById(userId);

            if (!verifyUser) {
                console.log(verifyUser);
                return res.status(401).json({ message: "Faça login novamente.", sucess: false });
            }

            const searchItem = await Stock.findById(idImage);

            const stockAmount = searchItem.stockQTD

            if (amount > stockAmount) {
                return res.status(401).json({ message: "Infelizmente não temos essá quantidade no estoque", sucess: false, stockAmount });
            }

            if (stockAmount <= 0) {
                return res.status(409).json({ message: "Infelizmente estamos sem estoque desse produto no momento", sucess: false, stock: stockAmount, });
            }

            const newStock = await Stock.findOneAndUpdate(
                { _id: idImage },
                { $inc: { stockQTD: -amount } },
                { new: true }
            );

            if (!newStock) {
                console.log(newStock)
                return res.status(400).json({ message: "Estamos com problemas tente novamente mais tarde.", sucess: false });
            }

            return res.status(200).json({ message: "Parabéns! Seu pedido foi reservado com sucesso.", sucess: true });

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Houve um erro, tente novamente mais tarde", sucess: false })
        }

    }

}

module.exports = stockManager;