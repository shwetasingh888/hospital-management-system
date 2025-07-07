import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/patients/${id}/details`)
      .then(res => {
        setPatient(res.data.patient);
        setAppointments(res.data.appointments);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!patient) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-500 to-indigo-800 text-white">
      <div className="mb-4">
        <Link to="/" className="underline">← Back to Home</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">{patient.name}'s Details</h1>
      <div className="bg-white bg-opacity-10 p-4 rounded mb-6">
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="space-y-2">
          {appointments.map(a => (
            <li key={a.id} className="bg-white bg-opacity-10 p-2 rounded">
              <span>{a.date} - {a.reason}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
