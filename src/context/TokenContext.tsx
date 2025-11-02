import { createContext, useContext, useState, ReactNode } from 'react'

interface TokenContextType {
  tokens: number
  addTokens: (amount: number) => void
  useToken: () => boolean
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
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

  return (
    <TokenContext.Provider
      value={{
        tokens,
        addTokens,
        useToken,
        isAuthenticated,
        setAuthenticated: setIsAuthenticated,
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

