import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TokenDisplay from '../components/TokenDisplay'
import PricingComponent from '../components/Pricing'
import { useTokens } from '../context/TokenContext'

const PageBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to bottom right, #F9F9FC, #FFFFFF)',
  minHeight: '100vh',
  padding: theme.spacing(4, 2),
}))

const InfoCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  padding: theme.spacing(3),
}))

function PricingPage() {
  const navigate = useNavigate()
  const { tokens, addTokens } = useTokens()

  const pricingPackages = [
    { id: '1', tokens: 5, price: 2 },
    { id: '2', tokens: 15, price: 5, popular: true },
    { id: '3', tokens: 50, price: 10 },
  ]

  const handleBuyTokens = (pkg: { id: string; tokens: number; price: number }) => {
    addTokens(pkg.tokens)
    alert(`Purchased ${pkg.tokens} tokens for $${pkg.price}!`)
    navigate('/')
  }

  return (
    <PageBox>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <TokenDisplay tokens={tokens} />
          <Typography variant="h1" gutterBottom>
            Buy Tokens
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600 }}>
            1 token = 1 AI image generation • Watermark removal requires paid token
          </Typography>
        </Box>

        <PricingComponent packages={pricingPackages} onSelect={handleBuyTokens} />

        <Box sx={{ mt: 6 }}>
          <InfoCard>
            <Typography variant="h3" gutterBottom>
              💰 Ways to Earn Free Tokens
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Watch ads - Earn 1 token per ad" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Share on social media - Earn 2 tokens per share" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Refer a friend - Earn 5 tokens when they sign up" />
              </ListItem>
            </List>
          </InfoCard>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Container>
    </PageBox>
  )
}

export default PricingPage

