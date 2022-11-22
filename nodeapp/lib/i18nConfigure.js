'use strict';

const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locales'),

  //Recomendaciones por tutor
  defaultLocale: 'en',
  autoReload: true, //recarga el fichero de idioma cuando cambia
  syncFiles: true, //sincroniza locale información a través de todos los ficheros, y
  //creará automaticamente tantos ficheros en 'locales' como idiomas configuremos
  cookie: 'nodeapp-locale',
});

// para utilizar en scripts
i18n.setLocale('en');

module.exports = i18n;
