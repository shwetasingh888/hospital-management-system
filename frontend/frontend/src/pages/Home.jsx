import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "" });
  const [newAppointment, setNewAppointment] = useState({ patient_id: "", date: "", reason: "" });
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchPatients = () => {
    axios.get("http://localhost:5000/api/patients")
      .then(res => setPatients(res.data))
      .catch(err => console.error(err));
  };

  const fetchAppointments = () => {
    axios.get("http://localhost:5000/api/appointments")
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  };

  const addPatient = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/patients", newPatient)
      .then(() => {
        setNewPatient({ name: "", age: "", gender: "" });
        fetchPatients();
      })
      .catch(err => console.error(err));
  };

  const addAppointment = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/appointments", newAppointment)
      .then(() => {
        setNewAppointment({ patient_id: "", date: "", reason: "" });
        fetchAppointments();
      })
      .catch(err => console.error(err));
  };

  const deletePatient = (id) => {
    axios.delete(`http://localhost:5000/api/patients/${id}`)
      .then(() => fetchPatients())
      .catch(err => console.error(err));
  };

  const updatePatient = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/patients/${editingPatient.id}`, editingPatient)
      .then(() => {
        setEditingPatient(null);
        fetchPatients();
      })
      .catch(err => console.error(err));
  };

  const deleteAppointment = (id) => {
    axios.delete(`http://localhost:5000/api/appointments/${id}`)
      .then(() => fetchAppointments())
      .catch(err => console.error(err));
  };

  const updateAppointment = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/appointments/${editingAppointment.id}`, editingAppointment)
      .then(() => {
        setEditingAppointment(null);
        fetchAppointments();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-500 to-indigo-800 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🏥 Hospital Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Add new patient */}
        <div className="bg-white bg-opacity-10 p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Add New Patient</h2>
          <form onSubmit={addPatient} className="space-y-2">
            <input type="text" placeholder="Name" className="w-full p-2 rounded bg-white bg-opacity-20"
              value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} />
            <input type="number" placeholder="Age" className="w-full p-2 rounded bg-white bg-opacity-20"
              value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} />
            <input type="text" placeholder="Gender" className="w-full p-2 rounded bg-white bg-opacity-20"
              value={newPatient.gender} onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })} />
            <button type="submit" className="bg-green-500 w-full p-2 rounded">Add Patient</button>
          </form>
        </div>

        {/* Add new appointment */}
        <div className="bg-white bg-opacity-10 p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Add New Appointment</h2>
          <form onSubmit={addAppointment} className="space-y-2">
            <select className="w-full p-2 rounded bg-white bg-opacity-20"
              value={newAppointment.patient_id} onChange={e => setNewAppointment({ ...newAppointment, patient_id: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="date" className="w-full p-2 rounded bg-white bg-opacity-20"
              value={newAppointment.date} onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })} />
            <input type="text" placeholder="Reason" className="w-full p-2 rounded bg-white bg-opacity-20"
              value={newAppointment.reason} onChange={e => setNewAppointment({ ...newAppointment, reason: e.target.value })} />
            <button type="submit" className="bg-blue-500 w-full p-2 rounded">Add Appointment</button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patients list */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Patients</h2>
          <ul className="space-y-2">
            {patients.map(p => (
              <li key={p.id} className="bg-white bg-opacity-10 p-2 rounded flex justify-between items-center">
                <span>
                  <Link to={`/patients/${p.id}`} className="underline hover:text-yellow-300">{p.name}</Link>
                  {" "}({p.age} yrs, {p.gender})
                </span>
                <div className="space-x-2">
                  <button onClick={() => setEditingPatient(p)} className="text-yellow-300">✏️</button>
                  <button onClick={() => deletePatient(p.id)} className="text-red-400">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Appointments list */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Appointments</h2>
          <ul className="space-y-2">
            {appointments.map(a => (
              <li key={a.id} className="bg-white bg-opacity-10 p-2 rounded flex justify-between items-center">
                <span>{a.date} — {a.patient_name} ({a.reason})</span>
                <div className="space-x-2">
                  <button onClick={() => setEditingAppointment(a)} className="text-yellow-300">✏️</button>
                  <button onClick={() => deleteAppointment(a.id)} className="text-red-400">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit patient modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={updatePatient} className="bg-white text-black p-6 rounded space-y-2">
            <h2 className="text-xl font-semibold mb-2">Edit Patient</h2>
            <input type="text" className="w-full p-2 border"
              value={editingPatient.name} onChange={e => setEditingPatient({ ...editingPatient, name: e.target.value })} />
            <input type="number" className="w-full p-2 border"
              value={editingPatient.age} onChange={e => setEditingPatient({ ...editingPatient, age: e.target.value })} />
            <input type="text" className="w-full p-2 border"
              value={editingPatient.gender} onChange={e => setEditingPatient({ ...editingPatient, gender: e.target.value })} />
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setEditingPatient(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit appointment modal */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={updateAppointment} className="bg-white text-black p-6 rounded space-y-2">
            <h2 className="text-xl font-semibold mb-2">Edit Appointment</h2>
            <select className="w-full p-2 border"
              value={editingAppointment.patient_id} onChange={e => setEditingAppointment({ ...editingAppointment, patient_id: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="date" className="w-full p-2 border"
              value={editingAppointment.date} onChange={e => setEditingAppointment({ ...editingAppointment, date: e.target.value })} />
            <input type="text" className="w-full p-2 border"
              value={editingAppointment.reason} onChange={e => setEditingAppointment({ ...editingAppointment, reason: e.target.value })} />
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setEditingAppointment(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
