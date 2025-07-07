import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PatientDetail from "./pages/PatientDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patients/:id" element={<PatientDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
