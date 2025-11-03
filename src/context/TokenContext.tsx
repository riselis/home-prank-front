import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getTokenBalance } from '../api'

interface TokenContextType {
  tokens: number
  addTokens: (amount: number) => void
  useToken: () => boolean
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
  logout: () => Promise<void>
}

const TokenContext = createContext<TokenContextType | undefined>(undefined)

export function TokenProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const addTokens = (amount: number) => {
    setTokens((prev) => prev + amount)
  }

  const useToken = () => {
    if (tokens > 0) {
      setTokens((prev) => prev - 1)
      return true
    }
    return false
  }

  const logout = async () => {
    await supabase.auth.signOut()
    // Supabase automatski briše sesiju iz localStorage, ali osiguramo da se obriše i ručno
    setTokens(0)
    setIsAuthenticated(false)
  }

  useEffect(() => {
    let mounted = true
    setIsAuthenticated(false)
  
    const initAuth = async () => {
      // 1️⃣ Sačekaj da se Supabase rehidrira (asinhrono čitanje localStorage)
      const {
        data: { session },
      } = await supabase.auth.getSession()
  
      if (!mounted) return
  
      if (session) {
        try {
          const balance = await getTokenBalance()
          setTokens(balance)
          setIsAuthenticated(true)
        } catch (err) {
          console.error('Error fetching token balance:', err)
          setIsAuthenticated(true)
        }
      }
  
      // 2️⃣ Slušaj dalju promenu stanja (npr. auto-refresh tokena, logout, login)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return
  
        if (session && event === 'SIGNED_IN') {
          try {
            const balance = await getTokenBalance()
            setTokens(balance)
            setIsAuthenticated(true)
          } catch (err) {
            console.error('Error fetching token balance:', err)
            setIsAuthenticated(true)
          }
        } else if (event === 'SIGNED_OUT') {
          setTokens(0)
          setIsAuthenticated(false)
        }
      })
  
      return () => {
        mounted = false
        subscription.unsubscribe()
      }
    }
  
    initAuth()
  }, [])
  

  return (
    <TokenContext.Provider
      value={{
        tokens,
        addTokens,
        useToken,
        isAuthenticated,
        setAuthenticated: setIsAuthenticated,
        logout,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

export function useTokens() {
  const context = useContext(TokenContext)
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider')
  }
  return context
}

