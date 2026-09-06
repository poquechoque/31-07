import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import OferenteLayout from "../layouts/OferenteLayout";
import SolicitanteLayout from "../layouts/SolicitanteLayout";

// Páginas públicas (Landing)
import HomePage from "../pages/HomePage";
import ComoAdoptarPage from "../pages/ComoAdoptarPage";
import SobreNosotrosPage from "../pages/SobreNosotrosPage";
import LoginPage from "../pages/auth/LoginPage";
import RegistroPage from "../pages/auth/RegistroPage";
import MascotasLandingPage from "../pages/MascotasPage";
import MascotaDetallePage from "../pages/MascotaDetallePage";  

// Páginas Admin
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminTiposPage from "../pages/admin/AdminTiposPage";
import AdminRazasPage from "../pages/admin/AdminRazasPage";
import AdminAdopcionesPage from "../pages/admin/AdminAdopcionesPage";
import AdminReportesPage from "../pages/admin/AdminReportesPage";
import AdminUsuariosPage from "../pages/admin/AdminUsuariosPage";

// Páginas Oferente
import PanelOferentePage from "../pages/oferente/PanelOferentePage";
import NuevaMascotaPage from "../pages/oferente/NuevaMascotaPage";
import EditarMascotaPage from "../pages/oferente/EditarMascotaPage";
import MisMascotasPage from "../pages/oferente/MisMascotasPage";
import OferenteMascotaDetallePage from "../pages/oferente/OferenteMascotaDetallePage"; 
import SolicitudesRecibidasPage from "../pages/SolicitudesRecibidasPage";
import MisAdopcionesOferentePage from "../pages/oferente/MisAdopcionesPage";

// Páginas Solicitante
import MisSolicitudesPage from "../pages/solicitante/MisSolicitudesPage";
import NuevaSolicitudPage from "../pages/solicitante/NuevaSolicitudPage";
import MisAdopcionesSolicitantePage from "../pages/solicitante/MisAdopcionesPage";
import BuscarMascotasPage from "../pages/solicitante/BuscarMascotasPage";

// Componentes
import { PrivateRoute } from "../components/common/PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/*  RUTAS PÚBLICAS con PublicLayout (sin sidebar) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/como-adoptar" element={<ComoAdoptarPage />} />
          <Route path="/sobre-nosotros" element={<SobreNosotrosPage />} />
          <Route path="/mascotasLanding" element={<MascotasLandingPage />} />
          <Route path="/mascotas/:id" element={<MascotaDetallePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
        </Route>

        {/*  RUTAS DE ADMINISTRADOR */}
        <Route element={<PrivateRoute allowedRoles={['administrador']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
            <Route path="/admin/tipos" element={<AdminTiposPage />} />
            <Route path="/admin/razas" element={<AdminRazasPage />} />
            <Route path="/admin/adopciones" element={<AdminAdopcionesPage />} />
            <Route path="/admin/reportes" element={<AdminReportesPage />} />
          </Route>
        </Route>

        {/* RUTAS DE OFERENTE */}
        <Route element={<PrivateRoute allowedRoles={['oferente']} />}>
          <Route element={<OferenteLayout />}>
            <Route path="/panel-oferente" element={<PanelOferentePage />} />
            <Route path="/mascotas/nueva" element={<NuevaMascotaPage />} />
            <Route path="/mascotas/editar/:id" element={<EditarMascotaPage />} />
            <Route path="/mis-mascotas" element={<MisMascotasPage />} />
            
    <Route path="/oferente/mascota/:id" element={<OferenteMascotaDetallePage />} />

            <Route path="/solicitudes/recibidas" element={<SolicitudesRecibidasPage />} />
            <Route path="/mis-adopciones-oferente" element={<MisAdopcionesOferentePage />} />
          </Route>
        </Route>

        {/*  RUTAS DE SOLICITANTE */}
        <Route element={<PrivateRoute allowedRoles={['solicitante']} />}>
          <Route element={<SolicitanteLayout />}>
            <Route path="/buscar-mascotas" element={<BuscarMascotasPage />} />
            <Route path="/mis-solicitudes" element={<MisSolicitudesPage />} />
            <Route path="/solicitudes/nueva/:mascotaId" element={<NuevaSolicitudPage />} />
            <Route path="/mis-adopciones-solicitante" element={<MisAdopcionesSolicitantePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;