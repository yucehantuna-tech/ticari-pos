import LicenseGate from "./components/LicenseGate.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Satis from "./pages/Satis.jsx";
import Urunler from "./pages/Urunler.jsx";
import Cari from "./pages/Cari.jsx";
import Kasa from "./pages/Kasa.jsx";
import Raporlar from "./pages/Raporlar.jsx";
import Fis from "./pages/Fis.jsx";
import Etiket from "./pages/Etiket.jsx";

export default function App() {
  return (
    <LicenseGate><div className="app">
      <Sidebar />
      <div className="content">
        <Header />
        <div className="page">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/satis" element={<Satis />} />
            <Route path="/urunler" element={<Urunler />} />
            <Route path="/cari" element={<Cari />} />
            <Route path="/kasa" element={<Kasa />} />
            <Route path="/raporlar" element={<Raporlar />} />

            {/* Yazdırma sayfaları */}
            <Route path="/fis/:id" element={<Fis />} />
            <Route path="/etiket/:id" element={<Etiket />} />

            <Route path="*" element={<div>Sayfa bulunamadı</div>} />
          </Routes>
        </div>
      </div>
    </div></LicenseGate>); }






