import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export default function ProtectedRoute({ children, role }) {
    const { token, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (role && user?.role !== role) {
        return <Navigate to="/login" replace />;
    }

    return children;
}