require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const users = require('./routes/login.js');
const managerStock = require('./routes/siteManager.js')

const app = express();
const PORT = process.env.PORT || 8080;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@meteoraapi.cklzu.mongodb.net/?retryWrites=true&w=majority&appName=MeteoraAPI0.0.1/Curso`); /*url banco de dados*/

const db = mongoose.connection

db.on("error", () => { console.log(`Houve um erro`) }); /*Caso ocorra um erro ele avisa*/
db.once("open", () => { console.log(`Banco de dados carregado`) });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', users)
app.use('/manager', managerStock)


/*RESPOSTA SERVER*/
app.listen(PORT, (err) => {
    if (err) {
        console.log(`Houve um erro ao iniciar o servidor: ${err}`)
    } else {
        console.log(`Server running on port: ${PORT}`)
    }
});

