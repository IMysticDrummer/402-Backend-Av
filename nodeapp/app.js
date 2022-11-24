var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

const basicAuthMiddleware = require('./lib/basicAuthMiddleware');
const sessionAuth = require('./lib/sessionAuthMiddleware');
//Internacionalización en un sólo paso
const i18n = require('./lib/i18nConfigure');
const LoginController = require('./routes/loginController');
const PrivadoController = require('./routes/privadoController');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.set('view engine', 'html'); // usa un motor de vista custom, llamado 'html'
app.engine('html', require('ejs').__express); // ese motor usa ejs

app.locals.title = 'Anuncios';

require('./lib/connectMongoose');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/pdf', express.static('d:/PDFS'));

/**
 * Rutas del API
 */
app.use('/api/agentes', basicAuthMiddleware, require('./routes/api/agentes'));

// Setup de i18n. Debe ir mínimo después del cookie parser
app.use(i18n.init);

/**
 * Rutas del Website
 */

const loginController = new LoginController();
const privadoController = new PrivadoController();

app.use(
  session({
    name: 'nodeapp-session',
    secret: 'ñlasdfj2308·$"·', //strong password generator, en este caso la pongo yo
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2, //expira a los dos días
    },
  })
);

app.use('/', require('./routes/index'));
app.use('/features', require('./routes/features'));
app.use('/change-locale', require('./routes/change-locale'));
app.use('/pedidos', require('./routes/pedidos'));
app.get('/login', loginController.index);
app.get('/privado', sessionAuth, privadoController.index);
app.post('/login', loginController.post);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // comprobar si es un error de validación
  if (err.array) {
    err.status = 422; // error de validación
    const errorInfo = err.array({ onlyFirstError: true })[0];
    console.log(errorInfo);
    err.message = `Error in ${errorInfo.location}, param "${errorInfo.param}" ${errorInfo.msg}`;
  }

  res.status(err.status || 500);

  // si es una petición al API, responderemos con JSON
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;
