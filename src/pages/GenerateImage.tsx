import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import TokenDisplay from '../components/TokenDisplay'
import { useTokens } from '../context/TokenContext'
import { generateImage } from '../api'
import { supabase } from '../lib/supabaseClient'

const PageBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to bottom right, #F9F9FC, #FFFFFF)',
  minHeight: '100vh',
  padding: theme.spacing(3, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4, 2),
  },
}))

const WatermarkBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(8px)',
  padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
  borderRadius: 100,
}))

const ShareCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(4),
  textAlign: 'center',
}))

function GenerateImage() {
  const navigate = useNavigate()
  const { tokens, useToken, isAuthenticated } = useTokens()
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [hasWatermark, setHasWatermark] = useState(true)
  const [showSignUp, setShowSignUp] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        // 1) Proveri da li je user ulogovan; ako nije – pošalji na /signup
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          setShowSignUp(true)
          return
        }
  
        setIsGenerating(true)
  
        // 2) (Opcionalno) prvo kreiraj generation zapis (RPC)
        // const generationId = await startGeneration({
        //   room_photo_id: '<uuid-snimljene-fotke-iz-storagea>',
        //   character_id: '<uuid>',
        //   action_id: '<uuid>',
        //   custom_prompt: null,
        //   realism_filter: false,
        // })
  
        const generationId = '<existing-generation-id>' // ako trenutno nemaš RPC, prosledi neki test ID
  
        // 3) Pozovi Edge Function
        const result = await generateImage(generationId)
  
        // 4) Prikaži rezultat
        setGeneratedImage(result.preview_url)
        setIsGenerating(false)
        // Po potrebi: osveži token balance pozivom getTokenBalance() ili ćeš to raditi iz backenda
      } catch (e) {
        console.error(e)
        setIsGenerating(false)
      }
    })()
  }, [])

  const handleRemoveWatermark = () => {
    if (tokens > 0) {
      useToken()
      setHasWatermark(false)
    } else {
      navigate('/pricing')
    }
  }

  const handleShare = (platform: string) => {
    const text = "There's literally a guy in our kitchen 😭💀"
    const url = window.location.href

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`)
        break
      case 'instagram':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard! Share on Instagram')
        break
      case 'tiktok':
        navigator.clipboard.writeText(text + ' ' + url)
        alert('Text copied! Share on TikTok')
        break
      default:
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
    }
  }

  const handleGenerateAnother = () => {
    if (tokens > 0) {
      navigate('/upload')
    } else {
      navigate('/pricing')
    }
  }

  if (showSignUp && !isAuthenticated) {
    navigate('/signup', { state: { returnTo: '/generate' } })
    return null
  }

  return (
    <PageBox>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <TokenDisplay tokens={tokens} />
        </Box>

        {isGenerating ? (
          <Card sx={{ textAlign: 'center', p: 4, maxWidth: 400, mx: 'auto' }}>
            <CircularProgress
              sx={{
                color: 'primary.main',
                mb: 3,
              }}
              size={64}
            />
            <Typography variant="h2" gutterBottom>
              Generating your prank...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Creating a realistic AI image just for you!
            </Typography>
          </Card>
        ) : (
          <Stack spacing={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h2" gutterBottom>
                Your AI Prank Image
              </Typography>
              <Box sx={{ position: 'relative', maxWidth: 500, mx: 'auto', mb: 3 }}>
                <CardMedia
                  component="img"
                  image={generatedImage || ''}
                  alt="Generated prank"
                  sx={{
                    borderRadius: 2,
                    aspectRatio: '2/3',
                    objectFit: 'cover',
                  }}
                />
                {hasWatermark && (
                  <WatermarkBox>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      AI Prank Generator
                    </Typography>
                  </WatermarkBox>
                )}
              </Box>
              <Button
                variant={hasWatermark ? 'outlined' : 'contained'}
                onClick={handleRemoveWatermark}
                disabled={!hasWatermark || tokens === 0}
                sx={{ mb: 2 }}
              >
                {hasWatermark ? 'Remove Watermark (1 Token)' : 'Watermark Removed ✓'}
              </Button>
            </Card>

            <ShareCard>
              <Typography variant="h2" gutterBottom>
                Send this to your partner 😱😂
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 3, justifyContent: 'center' }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleShare('whatsapp')}
                  fullWidth
                  sx={{ maxWidth: 200 }}
                >
                  📱 WhatsApp
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleShare('instagram')}
                  fullWidth
                  sx={{ maxWidth: 200 }}
                >
                  📸 Instagram
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleShare('tiktok')}
                  fullWidth
                  sx={{ maxWidth: 200 }}
                >
                  🎵 TikTok
                </Button>
              </Stack>
            </ShareCard>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate('/')}>
                Home
              </Button>
              <Button variant="contained" onClick={handleGenerateAnother}>
                Generate Another Room
              </Button>
            </Stack>
          </Stack>
        )}
      </Container>
    </PageBox>
  )
}

export default GenerateImage

