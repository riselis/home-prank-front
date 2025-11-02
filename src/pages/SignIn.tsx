import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  TextField,
  Stack,
  Divider,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTokens } from '../context/TokenContext'
import { supabase } from '../lib/supabaseClient'

const PageBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to bottom right, #F9F9FC, #FFFFFF)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 2),
}))

const SignInCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: '0 auto',
  padding: theme.spacing(4),
}))

function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuthenticated } = useTokens()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const returnTo = (location.state as { returnTo?: string })?.returnTo || '/'

  const handleSignIn = async (method: 'email' | 'google' | 'apple') => {
    setIsLoading(true)
    if (method === 'email') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: '<ask-for-password-or-magic-link>' })
      if (error) alert(error.message)
      else {
        setAuthenticated(true)
        navigate(returnTo)
      }
    } else {
      const provider = method === 'google' ? 'google' : 'apple'
      const { error } = await supabase.auth.signInWithOAuth({ provider })
      if (error) alert(error.message)
    }
    setIsLoading(false)
  }

  return (
    <PageBox>
      <Container maxWidth="sm">
        <SignInCard>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h1" gutterBottom>
              Sign In
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back! Sign in to continue pranking
            </Typography>
          </Box>

          <form onSubmit={handleEmailSubmit}>
            <TextField
              fullWidth
              type="email"
              label="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || !email.trim()}
              sx={{ mb: 3 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In with Email'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleSignIn('google')}
              disabled={isLoading}
              startIcon={<span style={{ fontSize: 20 }}>🔍</span>}
            >
              Continue with Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleSignIn('apple')}
              disabled={isLoading}
              startIcon={<span style={{ fontSize: 20 }}>🍎</span>}
            >
              Continue with Apple
            </Button>
          </Stack>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/signup')}
                sx={{ textTransform: 'none', textDecoration: 'underline' }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </SignInCard>
      </Container>
    </PageBox>
  )
}

export default SignIn

