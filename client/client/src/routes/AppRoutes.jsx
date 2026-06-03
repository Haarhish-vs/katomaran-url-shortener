import { useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthContext } from '../context/AuthContext'
import Analytics from '../pages/Analytics'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ProtectedUrl from '../pages/ProtectedUrl'

export default function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/protected/:shortCode" element={<ProtectedUrl />} />
        <Route
          path="/analytics/:shortCode"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
