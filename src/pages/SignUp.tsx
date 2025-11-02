import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  Divider,
} from '@mui/material'
import { styled } from '@mui/material/styles'
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

function SignUp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTokens, setAuthenticated } = useTokens()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const returnTo = (location.state as { returnTo?: string })?.returnTo || '/'

  const handleSignUp = async (method: 'email' | 'google' | 'apple') => {
    setIsLoading(true)

    setTimeout(() => {
      setAuthenticated(true)
      addTokens(1)
      setIsLoading(false)
      navigate(returnTo)
    }, 1000)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      handleSignUp('email')
    }
  }

  return (
    <PageBox>
      <Container maxWidth="sm">
        <SignUpCard>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h1" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Sign up and get <strong>1 FREE Token</strong> to start pranking!
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
              {isLoading ? 'Signing up...' : 'Sign Up with Email'}
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
              onClick={() => handleSignUp('google')}
              disabled={isLoading}
              startIcon={<span style={{ fontSize: 20 }}>🔍</span>}
            >
              Continue with Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleSignUp('apple')}
              disabled={isLoading}
              startIcon={<span style={{ fontSize: 20 }}>🍎</span>}
            >
              Continue with Apple
            </Button>
          </Stack>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/signin')}
                sx={{ textTransform: 'none', textDecoration: 'underline' }}
              >
                Sign In
              </Button>
            </Typography>
          </Box>
        </SignUpCard>
      </Container>
    </PageBox>
  )
}

export default SignUp

