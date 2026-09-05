import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedToken) {
            try {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch (err) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
    }, [])

    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user');
        setToken(null)
        setUser(user)
    }

    return (
        <AuthContext.Provider value={{token, user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}