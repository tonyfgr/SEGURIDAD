FROM node:16

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar el package.json y package-lock.json (si existe) al contenedor
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm i --force

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto en el que la app escuchará
EXPOSE 5002

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
