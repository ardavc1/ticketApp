// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TicketListPage from "./pages/TicketListPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import Dashboard from "./pages/Dashboard";
import NewTicketPage from "./pages/NewTicketPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AllTicketsPage from "./pages/AllTicketPage";

function App() {
    const token = localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                {/* Ana sayfa: eğer token varsa tickets'a git, yoksa login'e */}
                <Route path="/" element={
                    token ? <Navigate to="/tickets" /> : <Navigate to="/login" />
                } />

                {/* Giriş sayfası */}
                <Route path="/login" element={<Login />} />

                {/* Role tabanlı korunan sayfalar */}
                <Route path="/dashboard" element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/alltickets" element={
                    <ProtectedRoute requiredRoles={["ADMIN"]}>
                        <AllTicketsPage />
                    </ProtectedRoute>
                } />

                <Route path="/tickets" element={
                    <ProtectedRoute requiredRoles={["ADMIN", "USER"]}>
                        <TicketListPage />
                    </ProtectedRoute>
                } />

                <Route path="/create" element={
                    <ProtectedRoute requiredRoles={["USER", "ADMIN"]}>
                        <CreateTicketPage />
                    </ProtectedRoute>
                } />

                <Route path="/new" element={
                    <ProtectedRoute requiredRoles={["USER", "ADMIN"]}>
                        <NewTicketPage />
                    </ProtectedRoute>
                } />

                <Route path="/tickets/:id" element={
                    <ProtectedRoute requiredRoles={["USER", "ADMIN"]}>
                        <TicketDetailPage />
                    </ProtectedRoute>
                } />

                {/* Tanımsız rota: token varsa tickets, yoksa login */}
                <Route path="*" element={
                    token ? <Navigate to="/tickets" /> : <Navigate to="/login" />
                } />
            </Routes>
        </Router>
    );
}

export default App;
