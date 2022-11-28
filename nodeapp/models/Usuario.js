'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailTrasportConfigure = require('../lib/emailTransportConfigure');
const nodemailer = require('nodemailer');

//crear el esquema
const usuarioSchema = mongoose.Schema({
  //con unique aseguramos que se genere un índice, y además sea único
  email: { type: String, unique: true },
  password: String,
});

//método estático para hacer el hash de una password
usuarioSchema.statics.hashPassword = function (passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 7);
};

//método en instacia para comparar
usuarioSchema.methods.comparePassword = function (passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password);
};

usuarioSchema.methods.enviarEmail = async function (asunto, cuerpo) {
  // recuperar el transport
  const transport = await emailTrasportConfigure();

  // enviar el email
  const result = await transport.sendMail({
    from: process.env.EMAIL_SERVICE_FROM,
    to: this.email,
    subject: asunto,
    html: cuerpo,
  });

  console.log(`Mensaje enviado: ${result.messageId}`);

  // previsualización del mansaje enviado
  console.log(
    `URL de previsualización: ${nodemailer.getTestMessageUrl(result)}`
  );

  return result;
};

// crear el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

//exportar el modelo
module.exports = Usuario;
