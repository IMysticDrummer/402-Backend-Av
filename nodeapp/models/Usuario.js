'use strict';

const mongoose = require('mongoose');

//crear el esquema
const usuarioSchema = mongoose.Schema({
  //con unique aseguramos que se genere un índice, y además sea único
  email: { type: String, unique: true },
  password: String,
});
// crear el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

//exportar el modelo
module.exports = Usuario;
