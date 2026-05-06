import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: '',
        role: null
    })
    const [loading, setLoading] = useState(true)

    // Update axios header whenever auth token changes
    useEffect(() => {
        if (auth?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
        } else {
            axios.defaults.headers.common['Authorization'] = ''
        }
    }, [auth?.token])

    useEffect(() => {
        const data = localStorage.getItem('auth')
        if (data !== null) {
            try {
                const parseData = JSON.parse(data)
                setAuth({
                    user: parseData.user,
                    token: parseData.token || '',
                    role: parseData.user?.role
                })
            } catch (e) {
                console.error('Error parsing auth data:', e)
                localStorage.removeItem('auth')
            }
        }
        setLoading(false)
    }, [])
    return (
        <AuthContext.Provider value={[auth, setAuth, loading]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export { useAuth, AuthProvider }
