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
Debemos llamar a la librería antes de nuestra aplicación express (antes de llamar a app). Normalmente será en `/bin/www` o en `/bin/cluster`.  
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

Consta de dos partes:

- **Identificación**: Decirle al backend quienes somos.
- **Autenticación**: Que el backend comprueba que de verdad somos quienes decimos. Para ello el backend pedirá algo que sólo nosotros tenemos.

### Atenticación por sesión

HTTP no tiene estado (stateless). Sin embargo hace falta en ocasiones tener guardado el estado.  
**Sesión**: forma en la que guardamos el estado del usuario.

Usuario ---------------------- Proceso --------------------------- Server
Sig In -----------> navegador envía las credenciales ---------> Crea y almacena la sesión  
Guarda cookie <---- Cookie con ID de sesión <------------------  
------------------> Petición con la cookie -------------------> Verifica la sesión
<------------------ Resonde con datos asegurado <--------------

La autenticación por sesión se basa en _cookies_.  
Los browsers guardan estos bloques de información y los envían automáticamente a los servidores.

Cliente ------------------------------------- Servidor ------------------------------- Almacén de sesiones  
_Guarda este producto en el carrito_ -------> Crea una sesión y guarda datos ---------->
Recibe la cookie con el id de sesión <------- Envía id de sesión  
Hace otra petición, adjuntando cookie ------> Comprueba en el almacén a quién pertenece la sesión -->  
Recibe una cookie con los datos y el id <---- Recupera los datos de sesión desde el almacén <--------

**Propiedades de la cookie**

- **Dominio**: para que sólo envie esa cookie a ese servidor.
- **path**: rueta _opcional_ de la página que ha puesto esa cookie. Si existe, sólo se enviará la cookie de vuelta a esa ruta.
- **expires**: fecha de expiración de la cookie.
- **secure**: si existe, sólo se puede enviar la cookie por protocolo HTTPS.
- **httpOnly**: si existe, sólo puede leer la cookie el servidor.
- **value**: los valores, separador por `;`, pueden terner nombre.

**Sesiones**
`npm install express-session`  
En la autenticación con sesiones, el backend debe enviar una identificación de sesión, pero los datos de la sesión quedan guardados en servidor.

**Posible procedimiento**

1. Generar un modelo para los usuarios  
   Normalmente será un username o mail y un password.  
   Es interesante que el username sea único (`unique` en mongoose) o que tenga algún tipo de índice para mejorar las búsquedas posteriores. Sino la velocidad de la app bajará sensiblemente.

   También es interesante generar un fichero index.js dentro de nuestros modelos, que exporte un objeto con todos los modelos que tengamos, y así podremos llamarlos posteriormente en nuestra aplicación, haciendo referencia sólamente al directorio de los modelos, y haciendo destructuring de lo que necesitemos. Ejemplo (suponemos que nuestros modelos están guardados en `/models`):

   ```javascript
   module.exports = {
     Agente: require('./Agente'),
     Usuario: require('./Usuario'),
   };
   ```

   Llamada posterior...

   ```javascript
   const { Agente, Usuario } = require('./models');
   ```

   1. **Contraseñas en la base de datos**
      Las contraseñas en la base de datos **deben estar codificadas** (resumidas = hasheadas = hechas un _hash_).  
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

2. Preparar una página de login, para realizar la autentificación  
   No olvidar preparar una ruta, o mejor, un controller.

   1. Usaremos ese controller en nuestra app con `app.get` o `app.post` según la petición a atender.
   2. Comprobaremos con nuestra base de datos si el user o email exisite, y si la contraseña corresponde a lo guardado. En ese caso redireccionaremos. En caso contrario, no permitiremos el paso.

3. Identificar las páginas que queremos que sean privadas

4. Preparamos nuestra sesión (no olvidar instalar el `express-session`)
5. **Configuración de las cookies**
   - _name_: nombre de la cookie
   - _secret_: clave para encriptar. Puede ser un "golpe de teclado" o usar algún método como `strongpasswordgenerator.org`
   - _saveUninitialized_: fuerza a que una sesión no inicializada, se guarde en el almacén del browser
   - _resave_: fuerza a que la sesión se guarde en el browser aunque nada haya cambiado
   - _cookie_: objeto que guarda las características de la cookie. Por ejemplo el tiempo máximo de expiración:
     ```javascript
     cookie: {
       maxAge: tiempo - en - milisegundos;
     }
     ```
   - _store_: Método de guardado de las sesiones. Por ejemplo se podría utilizar un connect-mongo (ver maś abajo)
6. Recoger el id de usuario cuando haga login y guardarlo en la sesión. Esto se puede hacer en nuesto _controller_ del login
7. Generar un middleware para comprobar si el usuario tiene sesión para poder entrar en las páginas seguras o por lo contrario le enviamos al login. Ponerlo como middleware en las páginas seguras.
8. Realizar un logout, que limpie la sesión. Se puede utilizar `req.session.regenerate`, que borra la sesión actual del usuario y genera una vacía.

- Para porder ver la sesión en todas las vistas, se puede crear un middleware en el app, despueś de la creación de la sesión, que coloque la sesión en las respuestas locales:

  ```javascript
  app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });
  ```

9. Preparar un almacén se sesiones que permita persistir las sesiones de usuarios

- **Almacenes de sesiones para express**
  - connect-mongo
  - **REDIS** --> muy rápido porque trabaja en su propia instancia de memoria.
  - Permiten guardar sesiones en base de datos para tenerlas disponibles.
  - `npm install connect-mongo`
  - cargar la librería (`require('connect-mongo')`)
  - usarla en la middleware de gestión de sesiones.

### Autenticación por API Key

Se trata de una key otorgada por un API (por ejemplo un banco u otro servidor seguro), que me permite programar app contra ese API, utilizando esa key como clave segura para las operaciones.  
Se deben enviar todas las peticiones con el API Key, como cabecera o parámetro GET.  
El API key es único e identifica al usuario de maner unícova.  
Siempre el la misma, no cambia ni hay que renovarla (salvo que nosotros lo solicitemos).

### Autenticación con JWT

Usuario ---------------------- Proceso --------------------------- Server
Sig In -----------> navegador envía las credenciales ---------> Valida en BD. Crea un token (JWT), con id-user  
Guarda token <----- Evía token sólo para esta sesión <------------------  
------------------> Petición con bearer token -------------------> Verifica token
<------------------ Resonde con datos asegurado <--------------

JWT es un formato estándar abierto. Dentro guarda datos en formato JSON.  
Forma segura y compacta de transmitir información.  
Firmada digitalmente.  
 Se pueden firmar con HMAC (algoritmo secreto) o con un par de claves públicas RSA (pública/privada).

Un JWT está formado por:

- _Cabecera_: JSON en formato base64 que indica el tipo de token y algoritmo usado para firmarlo.
- _Payload_: JSON de datos en formto base64. Cotiene los claims (claves del diccionario de datos).
- _Firma_: firma del token resultante de aplicar:  
  HMACRSA256( base64(header) + base64(payload) + <secret>).

¿Por qué usar JWT?

- Evitamos guardar la sesión en la base de datos.
- Es el usuario quien nos envía su información en todo momento.
- Es seguro, porque podemos validar que el token no ha sido alterado desde que nosotros lo enviamos.

Cliente ----------------------------------------------- Servidor
POST /login/ ----------------------------------------->  
<------------------------------------------------------ {token: <JWT>}  
GET /products/in/cart Authorization: <JWT> ----------->

#### Posible proceso para trabajar con JWT

Lo primero a tener en cuenta, es que los API's son consumidos por programas, por lo que las respuetas deben ser objetos JSON.  
Nuesto objetivo es devolver un token con el id del usuario.

1. Preparar un middleware que reciba la petición por `post`.

- Haremos comprobación de usuario y contraseña. Si no coinciden, devolveremos un objeto con error.
- Si coicinde, generaremos un token.  
  Librería para generar un json web token jsonwebtoken:  
  `npm install jsonwebtoken`
  **ATENCION** En el webtoken sólo se debe introducir la información mínima posible del usuario. Normalmente con el id de usuario sería suficente.  
  **Generación de un webtoken**
  - Con la librería anterior, utilizar `.sign({}, opciones...)` para generar el token. Los atributos del objeto son:
    - _objeto_: con los datos a guardar. Por ejemplo `{_id: usuario.id}`
    - _secret_: clave con la que voy a **firmar** el token. Una buena práctica es generarlo en una variable de entorno:  
      `proccess.env.JWT_PRIVATE_TOKEN`
    - _objeto-de-opciones_: Por lo menos la fecha de expiración del token:
      - \*expiresIn: '2d' --> expira en dos días  
        La función sign devuelve un `string` por lo que se puede usar directamente en una variable.

2. Preparar un middleware que requiera siempre el token cuando haya una petición

   1. Primero recogerá body, query-sting, o por cabecera (todas o alguna de ellas)

   ```javascript
   const jwtToken =
     req.get('Authorization') || req.query.token || req.body.token;
   ```

   2. Luego comprobaremos que lleva el token

   ```javascript
   if (!jwtToken) {
     const error = new Error('no token provided');
     error.status = 401;
     next(error);
     return;
   }
   ```

   3. Comprobaremos que el token es válido

   - Para ello utilizaremos la función `verify` de la librería. Los parámetros son:

     - _token_: el token a comprobar
     - _firma_: la firma secreta con la se codificó el token
     - _callback_: opcional. Recibe err y payload (lo que contiene el token). Hay que aprovechar para pasar el payload al siguiente middelware para su posible uso

       ```javascript
       jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
         if (err) {
           const error = new Error('ivalid token');
           error.status = 401;
           next(error);
           return;
         }
         // si es válido, continúo, pasando el id en este caso.
         // apiUserId es un nombre que ponemos nosotros.
         // _id es la clave con la que guardamos el id en el token.
         req.apiUserId = payload._id;
         next();
       });
       ```

   4. Si es válido, continuar (ver arriba)

**OTROS RECURSOS SOBRE SEGURIDAD**
Ver la página de OWASP Fundation (Open Web Application Security Project).
https://owasp.org/www-project-node.js-goat/

## Enviando emails

Es muy fácil, utilizando librerías.  
Como ejemplo, tenemos `nodemailer`.  
Es muy recomendable, para envío masivo de mails, el utilizar plataformas de envío de mails, para evitar que caigan en spam.
Nodemailer tiene un servicio de cuenta de test para desarroladores, que simula el envío del mail, sin enviarlo realmente, pero que te deja observar el resultado.

**Posible proceso**

1. Crear una librería para poder reutilizarla

   - Generar una función que exporte un `transport`

2. Utilizar esa función en alguna parte que dónde tengamos acceso a los datos a enviar. Por ejemplo, en el modelo, dejando todo preparardo para enviar el correo.
3. LLamar a esa función desde donde queramos enviar el correo, pasándole al asunto y el cuerpo.
   - En este punto, quitar el await para que no quede esperando en lo que se envía el email.

### Envío de e-mail con tareas en background

El proceso es sencillo. El cliente hace la petición. La app pide los datos a la BD. Indica a un servicio de cola de tareas, los mails que tiene que enviar. La app responde al cliente.  
La cola de tareas, envía a un worker que tienen suscrito, para que vaya enviando los emails.

### RabbitMQ

RabbitMQ es un servicio de mensagería y comunicación, pero tiene cola de tareas.  
Se puede ver ejemplos en https://rabbitmq.com/getstarted.html  
Para desarrolar se puede usar cloudamqp:

- Registrarse o entrar con la cuenta
- Crear una nueva instancia, poniendola nombre
  - nombre --> siguiente
  - elegir servicio cerca de dónde estamos --> siguiente -->
  - ejegir el único servicio gratuito -->
- Coger la url de los amqp details
- Esa url es que usaremos en nuestro .env de entorno de productor - consumidor

**Otras posibilidades**
Mongodbqueue. Es una forma de hacer lo mismo que rabbitmq pero con mongo.  
Se puede busar el repo y ver el uso.

## Websockets

Son servicios que permiten al servidor iniciar la comunicación interactiva a los clientes (un ejemplo es cuando enviamos un mensaje a través de facebook, y facebook informa al usuario concernido que tiene un mensaje).

- Es un protocolo estándar RFC 6455.
- Está diseñada para ser implementada en navegadores y servidores web, pero puede utilizarse por cualquier aplicación cliente/servidor.
- Usa los puertos habituales HTTP (80, 443).
- Atraviesa firewalls y proxies.
  Principales librerías de websocket:
- Socket.io (la más utilizada)
- Websocket-node
- ws

**Cómo implementar websockets**

1. Instalar express y websocket.io
2.

## Microservicios

**Cómo crear microservicios**

1. Iniciar npm
2. Posibilidad de incluir una librería para ayudare en microservicios:
   - **Cote**: Librería para node.js (sólo usa javascript).
     - Ideal para proyectos pequeños - llegando a medianos.
     - Cero configuración
     - Descentralizada
     - Autodescubrimiento
     - Tolerante al fallo
     - Escalable horizontalmente (más servidores con balanceo de carga)
     - Performante: Miles de mensajes por segundo
     - API humanizada
3. Generar los programas de microservicios
