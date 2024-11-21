# Paso 1: Preparar la aplicación
FROM node:18 AS build

# Definir el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto (asegúrate de que tu código ya esté en el directorio local)
COPY . /app

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Instalar las dependencias del proyecto
RUN npm install --force

# Paso 2: Servir la aplicación con un servidor Node.js simple
FROM node:18

# Copiar los archivos desde el build anterior
WORKDIR /app
COPY --from=build /app/ /app/

# Exponer el puerto 4200 para acceder a la aplicación
EXPOSE 4200

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--disable-host-check"]

