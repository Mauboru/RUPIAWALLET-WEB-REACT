import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NovaTransacao from "../pages/NovaTransacao";
import EditarTransacao from "../pages/EditarTransacao";
import EditarCategoria from "../pages/EditarCategoria";
import Dashboards from "../pages/Dashboards";
import Perfil from "../pages/Perfil";
import Buscar from "../pages/Buscar";
import NotFound from "../pages/errors/NotFound";
import NotAuthorized from "../pages/errors/NotAuthorized";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Login público */}
                <Route path="/" element={<Home />} />

                {/* Rota de erro */}
                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="*" element={<NotFound />} />

                <Route path="/inserir" element={<NovaTransacao />} />
                <Route path="/editar-transacao/:id" element={<EditarTransacao />} />
                <Route path="/editar-category/:id" element={<EditarCategoria />} />
                <Route path="/dashboards" element={<Dashboards />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/Buscar" element={<Buscar />} />
            </Routes>
        </Router>
    );
}