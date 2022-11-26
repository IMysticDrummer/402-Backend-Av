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
  - **path**: rueta *opcional* de la página que ha puesto esa cookie. Si existe, sólo se enviará la cookie de vuelta a esa ruta.  
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
  module.exports={
    Agente: require('./Agente'),
    Usuario: require('./Usuario')
  }
  ```
  Llamada posterior...  
  ```javascript
  const {Agente, Usuario}=require('./models')
  ```
2. Preparar una página de login, para realizar la autentificación  
  No olvidar preparar una ruta.  
  

- **Almacenes de sesiones para express**
  - connect-mongo
  - **REDIS**
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
- *Cabecera*: JSON en formato base64 que indica el tipo de token y algoritmo usado para firmarlo.  
- *Payload*: JSON de datos en formto base64. Cotiene los claims (claves del diccionario de datos).  
- *Firma*: firma del token resultante de aplicar:  
  HMACRSA256( base64(header) + base64(payload) + <secret>).  

¿Por qué usar JWT?  
- Evitamos guardar la sesión en la base de datos.  
- Es el usuario quien nos envía su información en todo momento.  
- Es seguro, porque podemos validar que el token no ha sido alterado desde que nosotros lo enviamos.  

Cliente ----------------------------------------------- Servidor
POST /login/ ----------------------------------------->  
<------------------------------------------------------ {token: <JWT>}  
GET /products/in/cart Authorization: <JWT> ----------->  



Librería para generar un json web token jsonwebtoken:  
`npm install jsonwebtoken`


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




