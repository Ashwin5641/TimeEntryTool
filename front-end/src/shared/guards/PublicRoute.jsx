import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export default function PublicRoute({ children }) {
    const { token, user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (token && user) {
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
}
