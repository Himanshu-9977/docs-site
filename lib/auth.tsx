"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"

interface User {
  id: string
  isAdmin: boolean
  isTemporary?: boolean
}

interface AuthContextType {
  user: User | null
  login: (isAdmin?: boolean) => void
  logout: () => void
  isLoading: boolean
  ensureUser: () => User
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Create a temporary user ID if none exists
  const createTemporaryUser = (): User => {
    const tempUser = {
      id: uuidv4(),
      isAdmin: false,
      isTemporary: true
    }

    try {
      localStorage.setItem("docs-temp-user", JSON.stringify(tempUser))
    } catch (error) {
      console.error("Error saving temporary user to localStorage:", error)
    }

    return tempUser
  }

  // Get or create a temporary user ID
  const getTemporaryUser = (): User | null => {
    try {
      const storedTempUser = localStorage.getItem("docs-temp-user")
      if (storedTempUser) {
        return JSON.parse(storedTempUser)
      }
      return createTemporaryUser()
    } catch (error) {
      console.error("Error getting temporary user from localStorage:", error)
      return createTemporaryUser()
    }
  }

  useEffect(() => {
    // Check for existing user in localStorage
    try {
      const storedUser = localStorage.getItem("docs-user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        // If no logged-in user, use a temporary user
        setUser(getTemporaryUser())
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
      // Fallback to temporary user
      setUser(getTemporaryUser())
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (isAdmin = false) => {
    const newUser = {
      id: uuidv4(),
      isAdmin,
      isTemporary: false
    }
    setUser(newUser)
    try {
      localStorage.setItem("docs-user", JSON.stringify(newUser))
      // Remove temporary user if exists
      localStorage.removeItem("docs-temp-user")
    } catch (error) {
      console.error("Error saving user to localStorage:", error)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem("docs-user")
      // Create a new temporary user
      const tempUser = createTemporaryUser()
      setUser(tempUser)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  // Ensure a user always exists (either logged in or temporary)
  const ensureUser = (): User => {
    if (user) return user
    const tempUser = getTemporaryUser()
    setUser(tempUser)
    return tempUser
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, ensureUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
