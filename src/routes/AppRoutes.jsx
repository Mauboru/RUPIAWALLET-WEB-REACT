import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CreateTransaction from "../pages/transactions/Create";
import CreateCategorie from "../pages/categories/Create";
import UpdateTransaciton from "../pages/transactions/Update";
import UpdateCategory from "../pages/categories/Update";
import Dashboards from "../pages/Dashboards";
import Perfil from "../pages/Perfil";
import Buscar from "../pages/Buscar";
import Login from "../pages/Login";
import NotFound from "../pages/errors/NotFound";
import NotAuthorized from "../pages/errors/NotAuthorized";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Login público */}
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

                {/* Rota de erro */}
                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="*" element={<NotFound />} />

                <Route path="/inserir/transacoes" element={<PrivateRoute><CreateTransaction /></PrivateRoute>} />
                <Route path="/inserir/categorias" element={<PrivateRoute><CreateCategorie /></PrivateRoute>} />
                <Route path="/editar/transacao/:id" element={<PrivateRoute><UpdateTransaciton /></PrivateRoute>} />
                <Route path="/editar/categoria/:id" element={<PrivateRoute><UpdateCategory /></PrivateRoute>} />
                
                <Route path="/dashboards" element={<PrivateRoute><Dashboards /></PrivateRoute>} />
                <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
                <Route path="/Buscar" element={<PrivateRoute><Buscar /></PrivateRoute>} />

                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}