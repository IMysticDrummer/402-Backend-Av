var express = require('express');
var router = express.Router();
const { query, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function (req, res, next) {
  const ahora = new Date();

  //Atención...  para que la internacionalización funcione, tenemos que hacerlo sobre la respuesta.
  res.locals.bienvenido = res.__('Wellcome');
  res.locals.codigo = '<script>alert("inyección de código")</script>';
  res.locals.usuarios = [
    { nombre: 'Jones', edad: 34 },
    { nombre: 'Brown', edad: 45 },
  ];

  res.render('index', {
    segundoActual: ahora.getSeconds(),
    color: 'rojo',
    estado: ahora.getSeconds() % 2 === 0,
  });
});

// Recibiendo parámetros en la ruta
router.get('/parametro_en_ruta/:numero', (req, res, next) => {
  const numero = req.params.numero;
  res.send('He recibido ' + numero);
});

router.get('/parametro_opcional/:talla?', (req, res, next) => {
  const laTallaRecibida = req.params.talla;
  res.send('La talla es ' + laTallaRecibida);
});

router.get('/piso/:piso([0-9]+)/puerta/:puerta', (req, res, next) => {
  console.log(req.params);
  res.send('ok');
});

router.get(
  '/en_query_string',
  [
    // validaciones
    query('orderby').isAlphanumeric().withMessage('must be alphanumeric'),
    query('solo').isNumeric().withMessage('must be numeric'),
    // query('color').custom(color => { aqui validaría el color })
  ],
  (req, res, next) => {
    validationResult(req).throw();
    console.log(req.query);
    const orderBy = req.query.orderby;
    const numero = req.query.solo;
    res.send('ordenar por ' + orderBy + ' y sacar solo ' + numero);
  }
);

router.post('/en_el_body', (req, res, next) => {
  console.log(req.body);

  res.send('ok');
});

module.exports = router;
