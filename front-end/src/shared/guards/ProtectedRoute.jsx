import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

export default function ProtectedRoute({children, role}) {
    const {token, user, loading} = useAuth();

    if (loading) {
        return <p>Loading.....</p>
    }

    if (!token) {
        return <Navigate to={'/login'} replace />
    }

    if (role && user?.role !== role) {
        return <Navigate to={'Unauthorized'} replace />
    }

    return children
}

