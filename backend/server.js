const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 5002;  // El puerto que quieres usar

const cors = require('cors');
app.use(cors());  // Habilitar CORS

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',     // Cambia esto si tu MySQL está en otro host
  user: 'root',          // Tu usuario de MySQL
  password: '123456',    // Tu contraseña de MySQL
  database: 'epp'        // El nombre de tu base de datos
});

// Conectar a la base de datos MySQL
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida.');
});

// Ruta para la autenticación de inicio de sesión
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  // Consultar el usuario en la base de datos
  db.query('SELECT * FROM usuario WHERE correo = ?', [correo], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = results[0];

    // Comparar la contraseña (sin encriptación, si usas encriptación debe compararse correctamente)
    if (contrasena === usuario.contrasena) {
      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user_id: usuario.id,
        user_nombre: usuario.nombre
      });
    } else {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  });
});

// Endpoint para obtener los detalles del usuario
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  console.log(`Buscando detalles para el usuario con ID: ${userId}`);

  db.query('SELECT * FROM usuario WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }
    if (results.length > 0) {
      const usuario = results[0];
      res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
});

// Endpoint para obtener los detalles del usuario
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  console.log(`Buscando detalles para el usuario con ID: ${userId}`);  // Agregar log

  db.query('SELECT * FROM usuario WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }
    if (results.length > 0) {
      const usuario = results[0];
      res.json({
        id: usuario.id,
        nombre: usuario.nombre, // Devuelve el nombre
        correo: usuario.correo, // Devuelve otros detalles si los necesitas
      });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
});

// Endpoint para registrar una infracción
app.post('/log_infraccion', (req, res) => {
  const { tipo } = req.body;

  // Determinar la tabla según el tipo de EPP
  let tableName = '';
  if (tipo === 'casco_incorrecto') tableName = 'infracciones_casco';
  else if (tipo === 'chaleco_incorrecto') tableName = 'infracciones_chaleco';
  else if (tipo === 'zapatos_incorrecto') tableName = 'infracciones_zapatos';
  else if (tipo === 'guantes_incorrecto') tableName = 'infracciones_guantes';

  // Validación adicional para evitar inserciones incorrectas
  if (tableName) {
    db.query(`INSERT INTO ${tableName} (fecha) VALUES (NOW())`, (err) => {
      if (err) return res.status(500).json({ error: 'Error al registrar infracción' });
      res.json({ message: 'Infracción registrada exitosamente' });
    });
  } else {
    res.status(400).json({ error: 'Tipo de infracción no válido' });
  }
});


// Endpoint para obtener las infracciones
app.get('/infracciones', (req, res) => {
  const query = `
    SELECT 
      (SELECT MAX(fecha) FROM infracciones_casco) AS casco,
      (SELECT MAX(fecha) FROM infracciones_chaleco) AS chaleco,
      (SELECT MAX(fecha) FROM infracciones_zapatos) AS zapatos,
      (SELECT MAX(fecha) FROM infracciones_guantes) AS guantes;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las infracciones' });
    }

    // Formatear las fechas al formato: dd/mm, hh:mm
    const formatearFecha = (fecha) => {
      if (!fecha) return 'No disponible';

      const date = new Date(fecha);

      // Obtener el día y mes con formato de dos dígitos
      const dia = String(date.getDate()).padStart(2, '0');  // Asegura que el día tenga 2 dígitos
      const mes = String(date.getMonth() + 1).padStart(2, '0');  // El mes es 0-indexado, por eso sumamos 1

      // Obtener la hora y minutos con formato de dos dígitos
      const hora = String(date.getHours()).padStart(2, '0');
      const minuto = String(date.getMinutes()).padStart(2, '0');

      // Devolver el formato deseado
      return `${dia}/${mes}, ${hora}:${minuto}`;
    };


    res.json({
      casco: formatearFecha(results[0].casco),
      chaleco: formatearFecha(results[0].chaleco),
      zapatos: formatearFecha(results[0].zapatos),
      guantes: formatearFecha(results[0].guantes)
    });
  });
});


// Ruta para obtener el total de infracciones por tipo
app.get('/infracciones/total', (req, res) => {
  // Consulta para contar el número de infracciones por cada tipo de EPP
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM infracciones_casco) AS total_casco,
      (SELECT COUNT(*) FROM infracciones_chaleco) AS total_chaleco,
      (SELECT COUNT(*) FROM infracciones_zapatos) AS total_zapatos,
      (SELECT COUNT(*) FROM infracciones_guantes) AS total_guantes
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener las infracciones' });
    res.json(results[0]);  // Devolvemos el resultado de la consulta
  });
});


// Ruta para obtener las infracciones filtradas por fecha
app.get('/infracciones/por-fecha', (req, res) => {
  const { fechaDesde, fechaHasta } = req.query;

  const query = `
    SELECT fecha, 
           (SELECT COUNT(*) FROM infracciones_casco WHERE fecha BETWEEN ? AND ?) AS total_casco,
           (SELECT COUNT(*) FROM infracciones_chaleco WHERE fecha BETWEEN ? AND ?) AS total_chaleco,
           (SELECT COUNT(*) FROM infracciones_zapatos WHERE fecha BETWEEN ? AND ?) AS total_zapatos,
           (SELECT COUNT(*) FROM infracciones_guantes WHERE fecha BETWEEN ? AND ?) AS total_guantes
    FROM infracciones
    WHERE fecha BETWEEN ? AND ?
    GROUP BY fecha
  `;

  db.query(query, [fechaDesde, fechaHasta, fechaDesde, fechaHasta, fechaDesde, fechaHasta, fechaDesde, fechaHasta], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener las infracciones' });
    res.json(results);
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
