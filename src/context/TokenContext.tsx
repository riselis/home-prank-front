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
    setTokens(0)
    setIsAuthenticated(false)
  }

  useEffect(() => {
    // osluškuj promenu auth stanja i povuci balance
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      if (session) {
        try {
          const balance = await getTokenBalance()

          console.log('balance', balance)
          setTokens(balance)
          setIsAuthenticated(true)
        } catch {
          // ignoriši ili ispiši grešku
        }
      } else {
        setTokens(0)
        setIsAuthenticated(false)
      }
    })
  
    // inicijalno učitaj ako već postoji sesija
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        try {
          const balance = await getTokenBalance()
          setTokens(balance)
          setIsAuthenticated(true)
        } catch {/* no-op */}
      }
    })
  
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

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

