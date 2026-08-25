"use client"

import * as React from "react"
import { api } from "../lib/api"

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  isVerified: boolean
  role: string
  phone?: string
  businessName?: string
  avatarUrl?: string
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  initialized: boolean
  login: (email: string, password: string, trustDevice: boolean) => Promise<{
    success: boolean
    message: string
    requiresVerification?: boolean
    otp?: string
  }>
  signup: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
    businessName?: string
  }) => Promise<{ success: boolean; message: string; otp?: string }>
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string; resetToken?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; resetToken?: string }>
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [initialized, setInitialized] = React.useState(false)

  const refreshUser = React.useCallback(async () => {
    const token = api.getToken()
    if (!token) {
      setInitialized(true)
      return
    }

    try {
      const res = await api.get<AuthUser>("/auth/me")
      if (res.success && res.data) {
        setUser(res.data)
      } else {
        api.removeToken()
        setUser(null)
      }
    } catch {
      api.removeToken()
      setUser(null)
    } finally {
      setInitialized(true)
    }
  }, [])

  React.useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = React.useCallback(
    async (email: string, password: string, trustDevice: boolean) => {
      setLoading(true)
      try {
        const res = await api.post<{
          user?: AuthUser
          token?: string
          requiresVerification?: boolean
          email?: string
          phone?: string
          otp?: string
        }>("/auth/login", {
          email,
          password,
        })
        if (res.success && res.data) {
          // If verification is required, don't set token — redirect to OTP
          if (res.data.requiresVerification) {
            return {
              success: true,
              message: res.message,
              requiresVerification: true,
              otp: res.data.otp,
            }
          }

          // Normal login — set token and user
          if (res.data.token && res.data.user) {
            api.setToken(res.data.token, trustDevice)
            setUser(res.data.user)
          }
          return { success: true, message: res.message }
        }
        return { success: false, message: res.message || "Login failed" }
      } catch {
        return { success: false, message: "Network error. Please try again." }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signup = React.useCallback(
    async (data: {
      firstName: string
      lastName: string
      email: string
      password: string
      phone?: string
      businessName?: string
    }) => {
      setLoading(true)
      try {
        const res = await api.post<{ user: AuthUser; token: string; otp?: string }>(
          "/auth/signup",
          data
        )
        if (res.success && res.data) {
          api.setToken(res.data.token, false)
          return { success: true, message: res.message, otp: res.data.otp }
        }
        return { success: false, message: res.message || "Signup failed" }
      } catch {
        return { success: false, message: "Network error. Please try again." }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const verifyOtp = React.useCallback(async (email: string, otp: string) => {
    setLoading(true)
    try {
      const res = await api.post<{ verified: boolean; resetToken?: string }>("/auth/verify-otp", { email, otp })
      if (res.success) {
        if (!res.data?.resetToken) {
          await refreshUser()
        }
        return { success: true, message: res.message, resetToken: res.data?.resetToken }
      }
      return { success: false, message: res.message || "Verification failed" }
    } catch {
      return { success: false, message: "Network error. Please try again." }
    } finally {
      setLoading(false)
    }
  }, [refreshUser])

  const forgotPassword = React.useCallback(async (email: string) => {
    setLoading(true)
    try {
      const res = await api.post<{ resetToken?: string }>("/auth/forgot-password", { email })
      return {
        success: res.success,
        message: res.message,
        resetToken: res.data?.resetToken,
      }
    } catch {
      return { success: false, message: "Network error. Please try again." }
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = React.useCallback(async (token: string, password: string) => {
    setLoading(true)
    try {
      const res = await api.post("/auth/reset-password", { token, password })
      return { success: res.success, message: res.message }
    } catch {
      return { success: false, message: "Network error. Please try again." }
    } finally {
      setLoading(false)
    }
  }, [])

  const changePassword = React.useCallback(
    async (currentPassword: string, newPassword: string) => {
      setLoading(true)
      try {
        const res = await api.post("/auth/change-password", {
          currentPassword,
          newPassword,
        })
        return { success: res.success, message: res.message }
      } catch {
        return { success: false, message: "Network error. Please try again." }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const logout = React.useCallback(() => {
    api.removeToken()
    setUser(null)
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      initialized,
      login,
      signup,
      verifyOtp,
      forgotPassword,
      resetPassword,
      changePassword,
      logout,
      refreshUser,
    }),
    [
      user,
      loading,
      initialized,
      login,
      signup,
      verifyOtp,
      forgotPassword,
      resetPassword,
      changePassword,
      logout,
      refreshUser,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
