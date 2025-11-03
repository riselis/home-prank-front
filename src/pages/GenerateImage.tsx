import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, Button, Card, CardContent,
  CardMedia, Stack, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { styled } from '@mui/material/styles'
import TokenDisplay from '../components/TokenDisplay'
import { useTokens } from '../context/TokenContext'
import { supabase } from '../lib/supabaseClient'
import {
  uploadRoomPhotoFromDataUrl,
  insertRoomPhotoRow,
  startGeneration,
  generateImage,
} from '../api'
import { GenerationStore } from '../store/generation'

const PageBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to bottom right, #F9F9FC, #FFFFFF)',
  minHeight: '100vh',
  padding: theme.spacing(3, 2),
  [theme.breakpoints.up('md')]: { padding: theme.spacing(4, 2) },
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

export default function GenerateImage() {
  const navigate = useNavigate()
  const { tokens, useToken, isAuthenticated } = useTokens()
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [hasWatermark, setHasWatermark] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        // 0) auth
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          navigate('/signup', { state: { returnTo: '/generate' } })
          return
        }

        // 1) input iz store-a
        const dataUrl = GenerationStore.getDataUrl()
        const character = GenerationStore.getCharacter()
        const action = GenerationStore.getAction()

        if (!dataUrl || !character || !action) {
          setErrorMsg('Missing input (photo/character/action). Please start again.')
          setIsGenerating(false)
          return
        }

        setIsGenerating(true)

        // 2) upload fotke (podržava i data URL i https URL)
        const storagePath = await uploadRoomPhotoFromDataUrl(dataUrl)

        // 3) insert u room_photos (room_id trenutno null)
        const roomPhotoId = await insertRoomPhotoRow(storagePath, null)

        // 4) RPC start_generation (slug-ovi iz Character/Action)
        const genId = await startGeneration({
          room_photo_id: roomPhotoId,
          character_slug: character.id,   // očekuješ slug; ako su ti UUID-ovi, prilagodi RPC
          action_slug: action.id,
          custom_prompt: character.customPrompt ?? null,
          realism_filter: false,
        })

        // 5) Edge funkcija generate-image (vrati preview_url)
        const result = await generateImage(genId)

        setGeneratedImage(result.preview_url ?? null)
        setIsGenerating(false)

        // 6) očisti store
        GenerationStore.reset()
      } catch (e: any) {
        console.error(e)
        // Ručnije hvatanje tipičnih slučajeva da lakše debuguješ
        if (String(e?.message || e).includes('Generation not found')) {
          setErrorMsg('Generation not found. Proveri da li je start_generation RPC deployovan i da li vraća ID.')
        } else if (String(e?.message || e).includes('row-level security')) {
          setErrorMsg('RLS blokira upis/čitanje. Proveri RLS politike za room_photos i generations.')
        } else if (String(e?.message || e).includes('storage')) {
          setErrorMsg('Problem sa uploadom u storage (bucket/permisiije).')
        } else {
          setErrorMsg(e?.message || 'Failed to generate image')
        }
        setIsGenerating(false)
      }
    })()
  }, [navigate, isAuthenticated])

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
    navigate('/upload')
  }

  return (
    <PageBox>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <TokenDisplay tokens={tokens} />
        </Box>

        {isGenerating ? (
          <Card sx={{ textAlign: 'center', p: 4, maxWidth: 420, mx: 'auto' }}>
            <CircularProgress sx={{ color: 'primary.main', mb: 3 }} size={64} />
            <Typography variant="h2" gutterBottom>
              Generating your prank...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Matching perspective, lighting and shadows…
            </Typography>
          </Card>
        ) : errorMsg ? (
          <>
            <Card sx={{ textAlign: 'center', p: 4, maxWidth: 500, mx: 'auto' }}>
              <Typography variant="h2" gutterBottom>Oops</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {errorMsg}
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="outlined" onClick={() => navigate('/upload')}>Try Again</Button>
                <Button variant="contained" onClick={() => navigate('/')}>Home</Button>
              </Stack>
            </Card>
          </>
        ) : (
          <Stack spacing={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h2" gutterBottom>Your AI Prank Image</Typography>
              <Box sx={{ position: 'relative', maxWidth: 500, mx: 'auto', mb: 3 }}>
                <CardMedia
                  component="img"
                  image={generatedImage || ''}
                  alt="Generated prank"
                  sx={{ borderRadius: 2, aspectRatio: '2/3', objectFit: 'cover' }}
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
              <Typography variant="h2" gutterBottom>Send this to your partner 😱😂</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => handleShare('whatsapp')} fullWidth sx={{ maxWidth: 200 }}>📱 WhatsApp</Button>
                <Button variant="contained" onClick={() => handleShare('instagram')} fullWidth sx={{ maxWidth: 200 }}>📸 Instagram</Button>
                <Button variant="contained" onClick={() => handleShare('tiktok')} fullWidth sx={{ maxWidth: 200 }}>🎵 TikTok</Button>
              </Stack>
            </ShareCard>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate('/')}>Home</Button>
              <Button variant="contained" onClick={handleGenerateAnother}>Generate Another Room</Button>
            </Stack>
          </Stack>
        )}
      </Container>

      <Dialog open={Boolean(errorMsg)} onClose={() => setErrorMsg(null)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{errorMsg}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorMsg(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageBox>
  )
}
