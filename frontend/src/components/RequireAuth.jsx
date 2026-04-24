import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const location = useLocation()
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('gc_token') : null

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

export default RequireAuth