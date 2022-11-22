'use strict';

const mongoose = require('mongoose');

//crear el esquema
const usuarioSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});
// crear el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

//exportar el modelo
module.exports = Usuario;
