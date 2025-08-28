import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateTransaction from "../pages/transactions/Create";
import CreateCategorie from "../pages/categories/Create";
import UpdateTransaciton from "../pages/transactions/Update";
import UpdateCategory from "../pages/categories/Update";
import Dashboards from "../pages/Dashboards";
import Buscar from "../pages/Buscar";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Rota de erro */}
                <Route path="*" element={<NotFound />} />

                <Route path="/inserir/transacoes" element={<PrivateRoute><CreateTransaction /></PrivateRoute>} />
                <Route path="/inserir/categorias" element={<PrivateRoute><CreateCategorie /></PrivateRoute>} />
                <Route path="/editar/transacao/:id" element={<PrivateRoute><UpdateTransaciton /></PrivateRoute>} />
                <Route path="/editar/categoria/:id" element={<PrivateRoute><UpdateCategory /></PrivateRoute>} />
                
                <Route path="/dashboards" element={<PrivateRoute><Dashboards /></PrivateRoute>} />
                <Route path="/" element={<PrivateRoute><Dashboards /></PrivateRoute>} />
                <Route path="/Buscar" element={<PrivateRoute><Buscar /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}