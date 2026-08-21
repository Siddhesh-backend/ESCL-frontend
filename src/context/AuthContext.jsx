import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await authService.getCurrentUser()

        if (response?.role) {
          setUser({
            email: response.email,
            role: response.role,
          })
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const response = await authService.login({
      email,
      password,
    })

    if (response?.message === 'Login Successful') {
      const loggedInUser = {
        email: response.email,
        role: response.role,
      }

      setUser(loggedInUser)
    }

    return response
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return ctx
}