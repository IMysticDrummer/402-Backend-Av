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
Allí metemos las variables de entorno con los valores que necesitemos.  
En la aplicación se utiliza con la instrucción `process.env.NUESTRA_VARIABLE`.  
Debemos llamar a la librería antes de nuestra aplicación express (antes de llamar a app).  
Utilizamos la instrucción `require('dotenv').config();`.  
**ATENCIÓN...** ESTE FICHERO NO HAY QUE METERLO EN EL REPO DE GIT, YA QUE PUEDE CONTENER PASSWORDS U OTRO TIPO DE INFORMACIONES QUE NO DEBEN SER MOSTRADAS.
Si hace falta crear un fichero, tendremos que dejar instrucciones con las instrucciones de cómo crearlo.  
Para ello hacemos una copia (.env.example) dónde pondríamos las instrucciones de cómo crearlo.
**Asegurar** que en el `.gitignore` metemos el fichero .env para que no suba a repo.
