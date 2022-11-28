const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const Agente = require('../../models/Agente');

// GET /api/agentes
// Devuelve una lista de agentes
router.get('/', async (req, res, next) => {
  try {
    //Simulamos que usamos el _id del usuario logado
    const userId = req.apiUserId;
    console.log({ userId });
    // filtros
    const name = req.query.name;
    const age = req.query.age;
    // paginación
    const skip = req.query.skip;
    const limit = req.query.limit;
    // selección de campos
    const fields = req.query.fields;
    const sort = req.query.sort;

    // ejemplos de peticiones
    // http://localhost:3000/api/agentes/?skip=2&limit=2&fields=name%20-_id
    // http://localhost:3000/api/agentes/?sort=age%20-name

    // creo el filtro vacio
    const filtro = {};

    if (name) {
      filtro.name = name;
    }

    if (age) {
      filtro.age = age;
    }

    const agentes = await Agente.lista(filtro, skip, limit, fields, sort);

    res.json({ results: agentes });
  } catch (err) {
    next(err);
  }
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
    res.json({ result: true });
  }
);

// GET /api/agentes/(_id)
// Devuelve un agente
router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    const agente = await Agente.lista({ _id: _id });

    res.json({ result: agente });
  } catch (error) {
    next(error);
  }
});

// PUT /api/agentes/(_id)  (body)
// Actualizar un agente
router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    const data = req.body;

    const agenteActualizado = await Agente.findOneAndUpdate(
      { _id: _id },
      data,
      {
        new: true, // esto hace que nos devuelva el documento actualizado
      }
    );

    res.json({ result: agenteActualizado });
  } catch (error) {
    next(error);
  }
});

// POST /api/agentes (body)
// Crea un agente
router.post('/', async (req, res, next) => {
  try {
    const agenteData = req.body;

    // instanciamos objeto en memoria
    const agente = new Agente(agenteData);

    console.log(`La edad de ${agente.name} es par?:`, agente.edadEsPar());

    // lo guardamos en la base de datos
    const agenteGuardado = await agente.save();

    res.json({ result: agenteGuardado });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/agentes/:_id
// Eliminar un agente
router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    await Agente.deleteOne({ _id: _id });

    res.json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
