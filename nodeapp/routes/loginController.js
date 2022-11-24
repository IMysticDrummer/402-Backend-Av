'use strict';

const { Usuario } = require('../models');

class LoginController {
  index(req, res, next) {
    res.locals.error = '';
    res.locals.email = '';
    res.render('login');
  }

  async post(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      //Buscar usuario en la BD
      //Momento para darse cuenta que hace falta crear un índice en la base de datos sobre el mail
      //para velocitar la base de datos
      const usuario = await Usuario.findOne({ email });
      //Si no lo encuentro o no coincide la contraseña --> error
      //if (!usuario || usuario.password != password) {
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.locals.error = res.__('Invalid credentials');
        res.locals.email = email;
        res.render('login');
        return;
      }

      req.session.usuarioLoggado = usuario._id;
      //Si existe y la contraseña coincide --> redirigir a privado
      res.redirect('/privado');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LoginController;
