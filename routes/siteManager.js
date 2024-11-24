const express = require('express');
const stockController = require('../controller/stockController')
const router = express.Router();

//Public route

router.post('/uploadStock', stockController.uploadStock);

//Rota para carregar Informacoes
router.get('/loadInfos', stockController.loadInfos);

//Rota para carregar os dados da imagem especifica
router.post('/getInfos', stockController.getInfos);

//Rota Para comprar e reduzir no estoque
router.post('/buyItem', stockController.buyItem)

module.exports = router;