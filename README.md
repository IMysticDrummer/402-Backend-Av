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
En unestro código, usaremos la función `i18n.__(...)`
