'use strict';

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    title: 'NodeApp API',
    version: '0.1',
    description: 'API de agentes',
  },
  apis: ['swagger.yaml'],
};

const especificacion = swaggerJSDoc(options);

module.exports = [swaggerUI.serve, swaggerUI.setup(especificacion)];
