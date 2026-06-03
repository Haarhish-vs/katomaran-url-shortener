import { createContext, useState } from 'react'
import { getToken, removeToken, setToken } from '../utils/token'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())

  const signIn = (nextToken) => {
    setToken(nextToken)
    setTokenState(nextToken)
  }

  const signOut = () => {
    removeToken()
    setTokenState(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
