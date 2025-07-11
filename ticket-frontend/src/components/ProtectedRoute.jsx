import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRoles }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const userRole = decoded.role;

        if (!requiredRoles.includes(userRole)) {
            return <Navigate to="/login" />; // veya /unauthorized
        }

        return children;
    } catch (e) {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
