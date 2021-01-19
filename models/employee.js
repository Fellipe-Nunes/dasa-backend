const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const FuncionarioSchema = new mongoose.Schema({
    nome : {
        type : String,
        required : true
    },
    sobrenome : {
        type : String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false        
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
}, { autoCreate: true })

module.exports = mongoose.model('funcionarios', FuncionarioSchema);