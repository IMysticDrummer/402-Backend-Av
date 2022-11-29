'use strict';

// microservicios de conversión de moneda

const { Responder } = require('cote');

// almacen de datos propio (en este caso podría ser una base datos)
const tasas = {
  USD_EUR: 0.95,
  EUR_USD: 1.05,
};

// lógica del microservicio

const responder = new Responder({ name: 'servicio de moneda' });

responder.on('convertir-moneda', (req, done) => {
  const { cantidad, desde, hacia } = req; //valores sacados de la declaración en app

  console.log(Date.now(), ' servicio: ', cantidad, desde, hacia);

  const tasa = tasas[`${desde}_${hacia}`];
  const resultado = cantidad * tasa;

  done(resultado);
});
