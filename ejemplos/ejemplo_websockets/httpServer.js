'use strict';

const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Servidor HTTP arrancado en http://localhost:3000');
});
