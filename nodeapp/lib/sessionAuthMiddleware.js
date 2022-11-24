'use strict';

module.exports = (req, res, next) => {
  if (!req.session.usuarioLoggado) {
    res.redirect('login');
    return;
  }
  next();
};
