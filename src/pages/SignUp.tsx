import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Box, Typography, Button, Card, TextField, Stack, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { supabase } from '../lib/supabaseClient'
import { useTokens } from '../context/TokenContext'

const PageBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to bottom right, #F9F9FC, #FFFFFF)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 2),
}))

const SignUpCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: '0 auto',
  padding: theme.spacing(4),
}))

export default function SignUp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTokens, setAuthenticated } = useTokens()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const returnTo = (location.state as { returnTo?: string })?.returnTo || '/'

  const handleSignUp = async (method: 'email' | 'google' | 'apple') => {
    setLoading(true)
    if (method === 'email') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else {
        addTokens(1)
        setAuthenticated(true)
        navigate(returnTo)
      }
    } else {
      const provider = method === 'google' ? 'google' : 'apple'
      const { error } = await supabase.auth.signInWithOAuth({ provider })
      if (error) alert(error.message)
    }
    setLoading(false)
  }

  return (
    <PageBox>
      <Container maxWidth="sm">
        <SignUpCard>
          <Typography variant="h1" textAlign="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" textAlign="center" gutterBottom>
            Get <strong>1 free token</strong> for signing up!
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSignUp('email')
            }}
          >
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button variant="contained" fullWidth type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>or</Divider>
          <Stack spacing={2}>
            <Button variant="outlined" onClick={() => handleSignUp('google')}>
              Continue with Google
            </Button>
            <Button variant="outlined" onClick={() => handleSignUp('apple')}>
              Continue with Apple
            </Button>
          </Stack>
        </SignUpCard>
      </Container>
    </PageBox>
  )
}