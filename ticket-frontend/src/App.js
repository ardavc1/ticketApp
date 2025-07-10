// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TicketListPage from "./pages/TicketListPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";




function App() {
    const token = localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/tickets" element={token ? <TicketListPage /> : <Navigate to="/login" />} />
                <Route path="/create" element={token ? <CreateTicketPage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={token ? "/tickets" : "/login"} />} />
                <Route path="/tickets/:id" element={<TicketDetailPage />} />
            </Routes>
        </Router>
    );
}

export default App;
