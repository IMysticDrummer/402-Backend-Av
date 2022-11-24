# 402-Backend-Av

Seguimiento clases backend avanzado FullStack Web Developper 13 Keepcoding

## HTTPS

Podemos usar https://ngrok.com para generar un certificado HTTPS.  
También tenemos npx localtunnel -p 3000

## Clusters

Sirve para dividir el proceso en varias copias de sí mismos, para aprovechar los núcleos de un procesador y evitar la característica mono-hilo de javascript, y poder atender menos peticiones.

## Internacionalización (multi-idioma y localización)

Se suele usar la librería i18n-node.  
`npm install i18n`  
Inicializas con `i18n.configure({...})`  
Crear los archivos de mensjes en carpeta `locales`  
En unestro código, usaremos la función `i18n.__(...)`. La llamaremos directamente como `__('texto')` en las vistas. En el código tenemos que asociar su llamada para variables, como función asociada a la respuesta:  
`res.locals.bienvenido = res.__('Wellcome');`.

**Librería de variables de entorno** dotenv.  
`npm i dotenv`.
Crear en el directorio un fichero `.env`.
Allí metemos las variables de entorno con los valores que necesitemos. El separador entre variables es símplemente un retorno de carro.  
En la aplicación se utiliza con la instrucción `process.env.NUESTRA_VARIABLE`.  
Debemos llamar a la librería antes de nuestra aplicación express (antes de llamar a app).  
Utilizamos la instrucción `require('dotenv').config();`.  
**ATENCIÓN...** ESTE FICHERO NO HAY QUE METERLO EN EL REPO DE GIT, YA QUE PUEDE CONTENER PASSWORDS U OTRO TIPO DE INFORMACIONES QUE NO DEBEN SER MOSTRADAS.
Si hace falta crear un fichero, tendremos que dejar instrucciones con las instrucciones de cómo crearlo.  
Para ello hacemos una copia (.env.example) dónde pondríamos las instrucciones de cómo crearlo.
**Asegurar** que en el `.gitignore` metemos el fichero .env para que no suba a repo.

**Recurso de plantillas bootstrap** --> Start Bootstrap

Para conseguir un cambio de idioma:

- Usar la función `getLocales` de i18n (se puede usar en ejs), para conseguir los idiomas configurados.
- Utilizar una ruta con params para pasar el idioma que se desea.
- Generar una ruta que trate esa dirección:
  - Utilizar dentro una cookie para guardar la preferencia (`res.cookie('nodeapp-locale', locale, {objeto para las características de la cookie})`).
  - Utilizar `res.redirect(req.get('Referer'))` para redirigir a la misma página.
  - En la app principal, preparar el middelware para capturar ese endpoint y que lo trate la ruta: `app.use('/change-locale', require('./routes/change-locale'))`.
  - Añadir configuración en i18nConfigure para añadir el nombre de la cookie (`cookie: 'nodeapp-locale'`).

**Cambiar las extensiones de los archivos ejs a html**  
Esto sirve para poder utilizar herramientas de desarrollo que muestran ayudas sobre html que no son viables en ejs.

```javascript
app.set('view engine', 'html'); // usa un motor de vista custom, llamado 'html'
app.engine('html', require('ejs').__express); // ese motor usa ejs
```

Luego podemos cambiar las extensiones de los archivos

## AUTENTICACIÓN

Vamos a utilizar:

- Sesiones por cookies para el website en el browser
- JWT para el API

**Cifrado de la contraseña**  
Las contraseñas no deben ser guardadas en claro en una base de datos.  
Debemos encriptarla, y nunca dejarlas en claro.  
Debemos hacer una hash (resumen) de la contraseña de forma unidireccional, para guardarlas.
Se utiliza una función criptográfica. Hay varias:

- MD5
- SHA1
- SHA2  
   ...
  Se recomienda la librería BCRYPT que está pensada para seguridad en contraseñas.  
   https://codahale.com/how-to-safely-store-a-password/
  `npm i bcrypt`

**Sesiones**
`npm install express-session`  
En la autenticación con sesiones, el backend debe enviar una identificación de sesión, pero los datos de la sesión quedan guardados en servidor.

- **Almacenes de sesiones para express**
  - connect-mongo
  - **REDIS**
  - Permiten guardar sesiones en base de datos para tenerlas disponibles.
  - `npm install connect-mongo`
  - cargar la librería (`require('connect-mongo')`)
  - usarla en la middleware de gestión de sesiones.
