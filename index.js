const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const rds_hostname = process.env.RDS_HOSTNAME;
const db = mysql.createConnection({
  host: rds_hostname,
  user: 'admin',
  password: 'TUDproj23',
  database: 'cars_db',
});

// Get all cars
app.get('/api/cars', (req, res) => {
  const sql = 'SELECT * FROM cars';
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error getting cars from database');
    } else {
      res.send(result);
    }
  });
});

// Create a car
app.post('/api/cars', (req, res) => {
  const { brand, registration, points } = req.body;
  const sql = 'INSERT INTO cars (brand, registration, points) VALUES (?, ?, ?)';
  db.query(sql, [brand, registration, points], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating car in database');
    } else {
      const id = result.insertId;
      const newCar = { id, brand, registration, points };
      res.send(newCar);
    }
  });
});

// Update a car
app.put('/api/cars', (req, res) => {
  const { id, brand, registration, points } = req.body;
  const sql = 'UPDATE cars SET brand=?, registration=?, points=? WHERE id=?';
  db.query(sql, [brand, registration, points, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating car in database');
    } else {
      const updatedCar = { id, brand, registration, points };
      res.send(updatedCar);
    }
  });
});

// Delete a car
app.delete('/api/cars', (req, res) => {
  const id = req.query.id;
  const sql = 'DELETE FROM cars WHERE id=?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting car from database');
    } else {
      const deletedCar = { id };
      res.send(deletedCar);
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
