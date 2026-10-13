import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function PublicRoute({children}) {
  const { customer } = useAuth()

  if(customer){
    return <Navigate to='/home' />
  }

  return children
}

export default PublicRoute