import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  Stack,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import TokenDisplay from '../components/TokenDisplay'
import Gallery from '../components/Gallery'
import Pricing from '../components/Pricing'
import { useTokens } from '../context/TokenContext'

const GradientBox = styled(Box)({
  background: 'linear-gradient(to bottom right, #F9F9FC, #FFFFFF)',
  minHeight: '100vh',
})

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 2),
  },
}))

const HeroTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(to top right, #7B5CFF, #C39BFF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: theme.spacing(2),
  fontSize: 32,
  fontWeight: 700,
  [theme.breakpoints.up('md')]: {
    fontSize: 48,
  },
}))

const SectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 2),
  },
}))

const CtaCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(to top right, #7B5CFF, #C39BFF)',
  color: '#FFFFFF',
  padding: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: theme.shape.borderRadius,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}))

const ReviewCard = styled(Card)(({ theme }) => ({
  background: '#F9F9FC',
  padding: theme.spacing(3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  height: '100%',
}))

function HomePage() {
  const navigate = useNavigate()
  const { tokens } = useTokens()

  const examplePranks = [
    {
      id: '1',
      image: '/images/plumberInAKitchen.png',
      caption: "Who's in my kitchen? 😂",
    },
    {
      id: '2',
      image: '/images/guySleeps.jpg',
      caption: 'Someone is sleeping in my living room 😱',
    },
    {
      id: '3',
      image: '/images/homelessGuyDoor.png',
      caption: 'Who is this? 💀',
    },
  ]

  const reviews = [
    {
      text: "I sent this to my boyfriend and he freaked out 😂",
      author: "Sarah M.",
    },
    {
      text: "Best prank ever! My wife actually checked the kitchen 😭",
      author: "Mike T.",
    },
    {
      text: "Hilarious! Shared on TikTok and it went viral 🔥",
      author: "Emma L.",
    },
  ]

  const pricingPackages = [
    { id: '1', tokens: 5, price: 2 },
    { id: '2', tokens: 15, price: 5, popular: true },
    { id: '3', tokens: 50, price: 10 },
  ]

  const handleBuyTokens = (pkg: { id: string; tokens: number; price: number }) => {
    navigate('/pricing')
  }

  return (
    <GradientBox>
      <HeroSection>
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center">
            <TokenDisplay tokens={tokens} />
            <HeroTitle variant="h1">AI Home Prank Generator</HeroTitle>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: 18 }}>
              Create hilarious, realistic pranks with AI
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/upload')}
              sx={{ minWidth: 180 }}
            >
              Try for Free
            </Button>
          </Stack>
        </Container>
      </HeroSection>

      <SectionBox sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom>
            Example Pranks
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            See what's possible with AI-powered pranks
          </Typography>
          <Gallery items={examplePranks} />
        </Container>
      </SectionBox>

      <SectionBox>
        <Container maxWidth="md">
          <CtaCard>
            <Typography variant="h2" gutterBottom sx={{ color: 'white', mb: 2 }}>
              Prank your husband / wife / friends now
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
              Create realistic AI images that will make them do a double-take!
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: '#FFFFFF',
                color: '#7B5CFF',
                '&:hover': {
                  background: '#F9F9FC',
                },
              }}
              onClick={() => navigate('/upload')}
            >
              Start Pranking →
            </Button>
          </CtaCard>
        </Container>
      </SectionBox>

      <SectionBox sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom>
            What People Are Saying
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ mt: 3 }}
          >
            {reviews.map((review, index) => (
              <ReviewCard key={index}>
                <Typography
                  variant="body1"
                  sx={{ fontStyle: 'italic', mb: 1 }}
                  gutterBottom
                >
                  "{review.text}"
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  - {review.author}
                </Typography>
              </ReviewCard>
            ))}
          </Stack>
        </Container>
      </SectionBox>

      <SectionBox sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom>
            Pricing
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Choose your token package
          </Typography>
          <Pricing packages={pricingPackages} onSelect={handleBuyTokens} />
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 4 }}
          >
            1 token = 1 AI image generation • Watermark removal requires paid token
          </Typography>
        </Container>
      </SectionBox>

      <SectionBox>
        <Container maxWidth="sm">
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => navigate('/upload')}
          >
            Start Pranking →
          </Button>
        </Container>
      </SectionBox>
    </GradientBox>
  )
}

export default HomePage
