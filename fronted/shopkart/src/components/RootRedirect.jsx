import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RootRedirect = () => {
    const { customer, loading } = useAuth()

    if (loading) {
        return <p>Loading...</p>
    }

    if (customer) {
        return <Navigate to="/home" replace />
    }

    return <Navigate to="/signup" replace />
}

export default RootRedirect