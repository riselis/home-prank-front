import { useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Button, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTokens } from '../context/TokenContext'
import TokenDisplay from './TokenDisplay'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  color: theme.palette.text.primary,
}))

const NavToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(1.5, 3),
  },
}))

const NavButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.5),
  },
}))

const LogoButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: 18,
  fontWeight: 700,
  color: theme.palette.primary.main,
  '&:hover': {
    background: 'transparent',
  },
}))

const NavLink = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  textTransform: 'none',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: active ? 600 : 400,
  '&:hover': {
    background: 'transparent',
    color: theme.palette.primary.main,
  },
}))


export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, tokens, logout } = useTokens()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <StyledAppBar position="sticky">
      <NavToolbar>
        <LogoButton onClick={() => navigate('/')}>
          🎭 Home Prank
        </LogoButton>

        <NavButtons>
          {isAuthenticated && (
            <>
              <NavLink active={isActive('/upload')} onClick={() => navigate('/upload')}>
                Create
              </NavLink>
              <NavLink active={isActive('/pricing')} onClick={() => navigate('/pricing')}>
                Pricing
              </NavLink>
              <Box sx={{ mx: 1 }}>
                <TokenDisplay tokens={tokens} />
              </Box>
            </>
          )}

          {isAuthenticated ? (
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                ml: 1,
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="text"
                onClick={() => navigate('/signin')}
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{ textTransform: 'none' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </NavButtons>
      </NavToolbar>
    </StyledAppBar>
  )
}

