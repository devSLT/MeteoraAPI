const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required:false,
    },  
    link: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required:true,
    },
    stockQTD:{
        type:Number,
        required:true,
        default: 50,
    }
});

module.exports = mongoose.model('Stock', stockSchema);