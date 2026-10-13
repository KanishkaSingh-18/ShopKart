import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const { customer, loading } = useAuth()

    if (loading) {
        return <p>Loading...</p>
    }

    if (!customer) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute