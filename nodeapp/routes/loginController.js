'use strict';

const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

class LoginController {
  index(req, res, next) {
    res.locals.error = '';
    res.locals.email = '';
    res.render('login');
  }

  //Login post desde el website
  async post(req, res, next) {
    try {
      const { email, password } = req.body;

      //Buscar usuario en la BD
      //Momento para darse cuenta que hace falta crear un índice en la base de datos sobre el mail
      //para velocitar la base de datos
      const usuario = await Usuario.findOne({ email });
      //Si no lo encuentro o no coincide la contraseña --> error
      //if (!usuario || usuario.password != password) {
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.status(401);
        res.locals.error = res.__('Invalid credentials');
        res.locals.email = email;
        res.render('login');
        return;
      }

      //Si existe y la contraseña coincide --> redirigir a privado
      //Apunto en la sesión que es un usuario logado
      req.session.usuarioLoggado = usuario._id;
      res.redirect('/privado');
    } catch (error) {
      next(error);
    }
  }

  //Login post desde API o al API
  async postJWT(req, res, next) {
    try {
      const { email, password } = req.body;

      //Buscar usuario en la BD
      //Momento para darse cuenta que hace falta crear un índice en la base de datos sobre el mail
      //para velocitar la base de datos
      const usuario = await Usuario.findOne({ email });
      //Si no lo encuentro o no coincide la contraseña --> error
      //if (!usuario || usuario.password != password) {
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.status = 401;
        res.json({ error: 'Invalid credentials' });
        return;
      }

      //Si existe y la contraseña coincide --> redirigir a privado

      //Generar un token JWT
      const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
        expiresIn: '2d',
      });
      // --> redirigir a la zona privada
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  logout(req, res, next) {
    req.session.regenerate((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/');
    });
  }
}

module.exports = LoginController;
