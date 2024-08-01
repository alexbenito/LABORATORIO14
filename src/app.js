import express from 'express';
import db from './db.js';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de Express
const app = express();

// Configuración del middleware para manejar JSON
app.use(express.json());
// app.use(cors());

// Rutas de ejemplo para CRUD en la tabla Persona

// Ruta para agregar una nueva persona
app.post('/persona', (req, res) => {
  const { Nombre, Apellidos, Sexo, Celular, Domicilio, Usuario, Pass } = req.body;

  const query = `
    INSERT INTO Persona (Nombre, Apellidos, Sexo, Celular, Domicilio, Usuario, Pass)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [Nombre, Apellidos, Sexo, Celular, Domicilio, Usuario, Pass], (err, results) => {
    if (err) {
      console.error('Error al insertar en la tabla Persona:', err);
      return res.status(500).json({ error: 'Error al insertar en la tabla Persona' });
    }
    res.status(201).json({ message: 'Persona creada exitosamente', id: results.insertId });
  });
});

// Ruta para obtener todas las personas
app.get('/personas', (req, res) => {
  const query = 'SELECT * FROM Persona';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener personas:', err);
      return res.status(500).json({ error: 'Error al obtener personas' });
    }
    res.json(results);
  });
});

// Ruta para obtener una persona por ID
app.get('/persona/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Persona WHERE Cod_Persona = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener la persona:', err);
      return res.status(500).json({ error: 'Error al obtener la persona' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.json(results[0]);
  });
});

// Ruta para actualizar una persona
app.put('/persona/:id', (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellidos, Sexo, Celular, Domicilio, Usuario, Pass } = req.body;

  const query = `
    UPDATE Persona SET Nombre = ?, Apellidos = ?, Sexo = ?, Celular = ?, Domicilio = ?, Usuario = ?, Pass = ?
    WHERE Cod_Persona = ?
  `;

  db.query(query, [Nombre, Apellidos, Sexo, Celular, Domicilio, Usuario, Pass, id], (err, results) => {
    if (err) {
      console.error('Error al actualizar la persona:', err);
      return res.status(500).json({ error: 'Error al actualizar la persona' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.json({ message: 'Persona actualizada exitosamente' });
  });
});

// Ruta para eliminar una persona
app.delete('/persona/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Persona WHERE Cod_Persona = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar la persona:', err);
      return res.status(500).json({ error: 'Error al eliminar la persona' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.json({ message: 'Persona eliminada exitosamente' });
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
