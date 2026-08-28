import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";


import HomePage from "../pages/HomePage";
 codex/mostrar-estructura-de-archivos-opcsxy
import MascotaDetallePage from "../pages/MascotaDetallePage";

 main
import MascotasPage from "../pages/MascotasPage";
import LoginPage from "../pages/auth/LoginPage";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mascotas" element={<MascotasPage />} />
 codex/mostrar-estructura-de-archivos-opcsxy
        <Route path="/mascotas/:slug" element={<MascotaDetallePage />} />

 main
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;
