import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";


import HomePage from "../pages/HomePage";
import MascotasPage from "../pages/MascotasPage";
import LoginPage from "../pages/auth/LoginPage";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mascotas" element={<MascotasPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;
