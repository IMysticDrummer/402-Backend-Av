'use strict';

// esta app necesita un microservicio que le haga los cambios de moneda

const { Requester } = require('cote'); // para comunicarme entre microservicios

const requester = new Requester({ name: 'app' });

const evento = {
  type: 'convertir-moneda', // esto debe llamarse así para que Cote funcione

  cantidad: 100,
  desde: 'USD',
  hacia: 'EUR',
};

//vamos a hacer que lo pida cada cierto tiempo
setInterval(() => {
  console.log(Date.now(), 'pido un cambio de moneda');
  requester.send(evento, (resultado) => {
    console.log(Date.now(), ' app obtiene resultado: ', resultado);
  });
}, 1000);
