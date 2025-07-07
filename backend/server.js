import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'user',
  database: process.env.DB_NAME || 'hospital_db'
});

// ✅ Fetch all patients
app.get('/api/patients', (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Fetch patient by ID with their appointments
app.get('/api/patients/:id', (req, res) => {
  const patientId = req.params.id;
  db.query(
    `SELECT p.*, a.id as appointment_id, a.date, a.reason 
     FROM patients p LEFT JOIN appointments a ON p.id = a.patient_id 
     WHERE p.id = ?`, 
    [patientId], 
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
});

// ✅ Add new patient
app.post('/api/patients', (req, res) => {
  const { name, age, gender } = req.body;
  db.query('INSERT INTO patients (name, age, gender) VALUES (?, ?, ?)',
    [name, age, gender],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, name, age, gender });
    });
});

// ✅ Fetch all appointments (with patient names)
app.get('/api/appointments', (req, res) => {
  db.query(
    `SELECT a.*, p.name as patient_name 
     FROM appointments a JOIN patients p ON a.patient_id = p.id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
});

// ✅ Add new appointment
app.post('/api/appointments', (req, res) => {
  const { patient_id, date, reason } = req.body;
  db.query(
    'INSERT INTO appointments (patient_id, date, reason) VALUES (?, ?, ?)',
    [patient_id, date, reason],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, patient_id, date, reason });
    });
});

// Update patient
app.put('/api/patients/:id', (req, res) => {
  const { name, age, gender } = req.body;
  const id = req.params.id;
  db.query('UPDATE patients SET name=?, age=?, gender=? WHERE id=?',
    [name, age, gender, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    });
});

// Delete patient
app.delete('/api/patients/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM patients WHERE id=?', [id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    });
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const { patient_id, date, reason } = req.body;
  const id = req.params.id;
  db.query('UPDATE appointments SET patient_id=?, date=?, reason=? WHERE id=?',
    [patient_id, date, reason, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    });
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM appointments WHERE id=?', [id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    });
});

// Get single patient + their appointments
app.get('/api/patients/:id/details', (req, res) => {
  const patientId = req.params.id;

  db.query('SELECT * FROM patients WHERE id = ?', [patientId], (err, patientResults) => {
    if (err) return res.status(500).json({ error: err });
    if (patientResults.length === 0) return res.status(404).json({ error: 'Patient not found' });

    db.query('SELECT * FROM appointments WHERE patient_id = ?', [patientId], (err2, appointmentResults) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.json({
        patient: patientResults[0],
        appointments: appointmentResults
      });
    });
  });
});


// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
