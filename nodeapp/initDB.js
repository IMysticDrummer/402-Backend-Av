'use strict';

const readline = require('readline');
require('dotenv').config();

// conectar a la base de datos
const connection = require('./lib/connectMongoose');

// cargar los modelos
const { Agente, Usuario } = require('./models');

async function main() {
  const continuar = await pregunta(
    'Estas seguro, seguro, seguro, de que quieres borrar toda la base de datos y cargara datos iniciales'
  );
  if (!continuar) {
    process.exit();
  }

  // inicializar la colección de agentes
  await initAgentes();

  // inicializamos la colección de usuarios
  await initUsuario();

  connection.close();
}

main().catch((err) => console.log('Hubo un error:', err));

async function initAgentes() {
  // borrar todos los documentos de agentes
  const deleted = await Agente.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} agentes.`);

  // crear agentes iniciales
  const inserted = await Agente.insertMany([
    { name: 'Brown', age: 34 },
    { name: 'Smith', age: 22 },
  ]);
  console.log(`Creados ${inserted.length} agentes.`);
}

async function initUsuario() {
  // borrar todos los documentos de agentes
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  // crear agentes iniciales
  const inserted = await Usuario.insertMany([
    {
      email: 'admin@example.com',
      password: await Usuario.hashPassword('1234'),
    },
    {
      email: 'user1@example.com',
      password: await Usuario.hashPassword('1234'),
    },
  ]);
  console.log(`Creados ${inserted.length} usuarios.`);
}

function pregunta(texto) {
  return new Promise((resolve, reject) => {
    const ifc = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    ifc.question(texto, (respuesta) => {
      ifc.close();
      if (respuesta.toLowerCase() === 'si') {
        resolve(true);
        return;
      }
      resolve(false);
    });
  });
}
