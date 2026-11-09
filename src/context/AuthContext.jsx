
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'

import adminAuthService from '../services/adminAuthService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore admin session when the application loads or refreshes.
  useEffect(() => {
    let isMounted = true

    const restoreSession = async () => {
      try {
        const response = await adminAuthService.getCurrentUser()

        if (isMounted && response?.role === 'ADMIN') {
          setUser({
            email: response.email,
            role: 'ADMIN',
          })
        }
      } catch (error) {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const response = await adminAuthService.login({
      email,
      password,
    })

    if (
      response?.role === 'ADMIN' ||
      response?.message?.toLowerCase().includes('admin login successful')
    ) {
      const loggedInUser = {
        email: response.email || email,
        role: 'ADMIN',
      }

      setUser(loggedInUser)
      return response
    }

    throw new Error(response?.message || 'Admin login failed')
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminAuthService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user && user.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
