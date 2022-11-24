'use strict';

const jwt = require('jsonwebtoken');

//módulo que exporta el middleware
module.exports = (req, res, next) => {
  //recoger el jwtToken
  const jwtToken =
    req.get('Authorization') || req.query.token || req.body.token;

  //comprobar qeu me han mandado el token
  if (!jwtToken) {
    const error = new Error('no token provided');
    error.status = 401;
    next(error);
    return;
  }

  //comprobar que el token es válido
  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      const error = new Error('invalid token');
      error.status = 401;
      next(error);
      return;
    }

    //si es válido, continuar
    req.apiUserId = payload._id; //esta propiedad apiUserId la defino yo aquí porque quiero, para que esté disponible para los siguientes middlewares
    next();
  });
};
