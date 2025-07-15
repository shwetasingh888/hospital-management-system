// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js'; // your db pool

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Fetch all patients
app.get('/api/patients', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM patients');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Add new patient
app.post('/api/patients', async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const result = await db.query(
      'INSERT INTO patients (name, age, gender) VALUES ($1, $2, $3) RETURNING *',
      [name, age, gender]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding patient:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT a.*, p.name as patient_name 
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Add new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { patient_id, date, reason } = req.body;
    const result = await db.query(
      'INSERT INTO appointments (patient_id, date, reason) VALUES ($1, $2, $3) RETURNING *',
      [patient_id, date, reason]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding appointment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Update patient
app.put('/api/patients/:id', async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const { id } = req.params;
    await db.query(
      'UPDATE patients SET name=$1, age=$2, gender=$3 WHERE id=$4',
      [name, age, gender, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Delete patient
app.delete('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM patients WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting patient:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Update appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { patient_id, date, reason } = req.body;
    const { id } = req.params;
    await db.query(
      'UPDATE appointments SET patient_id=$1, date=$2, reason=$3 WHERE id=$4',
      [patient_id, date, reason, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Delete appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM appointments WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch single patient + appointments
app.get('/api/patients/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    const patientResult = await db.query('SELECT * FROM patients WHERE id=$1', [id]);
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const appointmentsResult = await db.query('SELECT * FROM appointments WHERE patient_id=$1', [id]);
    res.json({
      patient: patientResult.rows[0],
      appointments: appointmentsResult.rows
    });
  } catch (err) {
    console.error('Error fetching patient details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
