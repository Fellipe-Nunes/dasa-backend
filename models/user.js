const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
    sexo : {
        type : String,
        required : true
    },
    nascimento : {
        type : String,
        required : true
    },
    nome : {
        type : String,
        required : true
    },
    sobrenome : {
        type : String,
        required : true
    },
    rg : {
        type : String,
        required : true,
        unique : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefone : {
        type : String,
        required : true
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
})

module.exports = mongoose.model('pacientes', PacienteSchema);