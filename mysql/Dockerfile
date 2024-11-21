# Usa la imagen oficial de MySQL como base
FROM mysql:8.0

# Establece el directorio de trabajo
WORKDIR /docker-entrypoint-initdb.d

# Copia el archivo SQL con las configuraciones de la base de datos
COPY init.sql /docker-entrypoint-initdb.d/

# Exponer el puerto en el que MySQL escucha por defecto
EXPOSE 3306

# Establece las variables de entorno para MySQL
ENV MYSQL_ROOT_PASSWORD=123456
ENV MYSQL_DATABASE=epp


# El contenedor se iniciará automáticamente ejecutando el servicio de MySQL
CMD ["mysqld"]