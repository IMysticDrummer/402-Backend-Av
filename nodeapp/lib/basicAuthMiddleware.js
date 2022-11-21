const auth = require('basic-auth');

module.exports = (req, res, next) => {

  const user = auth(req);

  // buscar en la base de datos el usuario user.name
  // si lo encentro, verifico la password (user.pass)

  if (!user || user.name !== 'admin' || user.pass !== '12345') {
    res.set('WWW-Authenticate', 'Basic realm=Authorization required');
    res.sendStatus(401);
    return;
  }

  next();
}