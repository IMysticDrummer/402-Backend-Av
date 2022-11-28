'use strict';

const connetionPromise = require('./connectAMQP');

const QUEUE_NAME = 'tareas';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

main().catch((err) => console.log('Hubo un error: ', err));

async function main() {
  //conectar al servidor amqp
  const connection = await connetionPromise;

  // crear un canal
  const canal = await connection.createChannel();

  //asegurar que existe una cola
  await canal.assertQueue(QUEUE_NAME, {
    durable: true, // la cola resiste a caídas y reinicios del broker
  });

  let keepSending = true;

  while (true) {
    const mensaje = {
      tarea: 'tarea a realizar número: ' + Date.now(),
    };

    if (!keepSending) {
      console.log('Buffer lleno, esperando evento drain...');
      await new Promise((resolve) => canal.on('drain', resolve));
    }
    // enviar mensaje al consumidor
    keepSending = canal.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(mensaje)),
      {
        persistent: true, // el mensaje sobrevive a reinicios del broker
      }
    );
    //console.log(`publicado el mensaje: ${mensaje.tarea}`);
    //await sleep(1);
  }
}
