import { db } from '../db.js';

// Get all patients
export const getPatients = (req, res) => {
  db.query('SELECT * FROM Patients', (err, results) => {
    if (err) return res.json(err);
    return res.json(results);
  });
};

// Add a new patient
export const addPatient = (req, res) => {
  const { name, age, gender, contactInfo, medicalHistory } = req.body;
  db.query('INSERT INTO Patients (Name, Age, Gender, ContactInfo, MedicalHistory) VALUES (?, ?, ?, ?, ?)',
    [name, age, gender, contactInfo, medicalHistory],
    (err, result) => {
      if (err) return res.json(err);
      return res.json({ message: 'Patient added successfully' });
    });
};

// Get appointments with doctor & patient name
export const getAppointments = (req, res) => {
  const sql = `
    SELECT a.AppointmentID, p.Name AS Patient, d.Name AS Doctor, a.AppointmentDate, a.Status
    FROM Appointments a
    JOIN Patients p ON a.PatientID = p.PatientID
    JOIN Doctors d ON a.DoctorID = d.DoctorID
  `;
  db.query(sql, (err, results) => {
    if (err) return res.json(err);
    return res.json(results);
  });
};
