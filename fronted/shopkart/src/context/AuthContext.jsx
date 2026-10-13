import { createContext, useEffect, useState, useContext } from "react"
import { axiosInstance } from "../axiosCalls/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const customerData = await axiosInstance.get('/customers/me')

                setCustomer(customerData.data.authenticatedCustomer)
            } catch (error) {
                setCustomer(null)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomer()
    }, [])

    return (
        <AuthContext.Provider value={{ customer, setCustomer, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)