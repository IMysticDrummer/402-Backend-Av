'use strict';

const socketio = require('socket.io');

module.exports = (server) => {
  //pasamos el server al servidor websockets utilizando el mismo puerto que el server
  const io = socketio(server);

  //ante cda nueva conexión, creamos un socket
  io.on('connection', (socket) => {
    console.log('Nueva conexión de un cliente, con el id:', socket.id);

    //nos suscribimos a eventos de cada socket
    //cuando llegue el evento 'nuevo-mensaje' hace algo
    socket.on('nuevo-mensaje', (texto) => {
      console.log('mensaje recibido de un cliente:', texto);

      //emitir el mensaje a todos los clientes conectados
      io.emit('mensaje-desde-el-servidor', texto);
    });
  });
};
