const express = require('express');
const loginController = require('../controller/loginController')
const router = express.Router();

//Public route
router.post('/newUser', loginController.newAcount);
router.post('/login', loginController.login)

router.get('/', loginController.hello)

//Private Route

//router.get('/user/:id', loginController.checkToken, loginController.idcheck)

module.exports = router;