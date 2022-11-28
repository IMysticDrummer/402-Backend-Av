'use strict';

const connectionPromise = require('./connectAMQP');

const QUEUE_NAME = 'tareas';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

main().catch((err) => console.log('Hubo un error: ', err));

async function main() {
  //conectar al servidor amqp
  const connection = await connectionPromise;

  // crear un canal
  const canal = await connection.createChannel();

  //asegurar que existe una cola
  await canal.assertQueue(QUEUE_NAME, {
    durable: true, // la cola resiste a caídas y reinicios del broker
  });

  //cantidad de mensajes que le pedimos al canal que nos dé cada vez
  canal.prefetch(1);

  canal.consume(QUEUE_NAME, async (mensaje) => {
    try {
      const payload = mensaje.content.toString();
      console.log(payload);
      await sleep(10); //Aqýí es dónde realizaríamos el procesamiento del mensaje
      //confirmo el procesamiento del mensaje
      canal.ack(mensaje);
    } catch (err) {
      console.log('error en el mensaje ', payload);
      //diferenciar si es un error operacional
      canal.nack(mensaje);
    }
  });
}
