import { useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthContext } from '../context/AuthContext'
import Analytics from '../pages/Analytics'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ProtectedUrl from '../pages/ProtectedUrl'
import ShortUrlRedirect from '../pages/ShortUrlRedirect'
import UserAnalytics from '../pages/UserAnalytics'

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
          path="/analytics"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:shortCode"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="/:shortCode" element={<ShortUrlRedirect />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
