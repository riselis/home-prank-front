import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  CardMedia,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { GenerationStore } from '../store/generation'

const PageBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to bottom right, #F9F9FC, #FFFFFF)',
  minHeight: '100vh',
  padding: theme.spacing(3, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4, 2),
  },
}))

const UploadCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 300ms ease-in-out',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: theme.palette.primary.main,
  },
}))

const PreviewCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: '0 auto',
  textAlign: 'center',
  padding: theme.spacing(3),
}))

function UploadPhoto() {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageSource, setImageSource] = useState<'gallery' | 'camera' | 'example' | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        GenerationStore.setDataUrl(reader.result as string)
        setImageSource('gallery')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTakePhoto = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setSelectedImage(reader.result as string)
          GenerationStore.setDataUrl(reader.result as string)
          setImageSource('camera')
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleUseExample = () => {
    setSelectedImage('https://via.placeholder.com/400x600/F9F9FC/7B5CFF?text=Example+Room')
    GenerationStore.setDataUrl('https://via.placeholder.com/400x600/F9F9FC/7B5CFF?text=Example+Room')
    setImageSource('example')
  }

  const handleContinue = () => {
    if (selectedImage) {
      navigate('/character')
    }
  }

  return (
    <PageBox>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" gutterBottom>
            Upload Room Photo
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Choose or take a photo of the room you want to prank
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box sx={{ flex: 1 }}>
            <label htmlFor="gallery-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <input
                id="gallery-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <UploadCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    📷
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Choose from Gallery
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select an existing photo from your device
                  </Typography>
                </CardContent>
              </UploadCard>
            </label>
          </Box>

          <Box sx={{ flex: 1 }}>
            <UploadCard onClick={handleTakePhoto}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  📸
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Take Photo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use your camera to take a new photo
                </Typography>
              </CardContent>
            </UploadCard>
          </Box>

          <Box sx={{ flex: 1 }}>
            <UploadCard onClick={handleUseExample}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  🏠
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Use Example Room
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try with a sample room image
                </Typography>
              </CardContent>
            </UploadCard>
          </Box>
        </Stack>

        {selectedImage && (
          <PreviewCard sx={{ mb: 4 }}>
            <Typography variant="h2" gutterBottom>
              Preview
            </Typography>
            <CardMedia
              component="img"
              image={selectedImage}
              alt="Selected room"
              sx={{
                borderRadius: 2,
                mb: 2,
                aspectRatio: '2/3',
                objectFit: 'cover',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {imageSource === 'example'
                ? 'Using example room'
                : imageSource === 'gallery'
                  ? 'Photo from gallery'
                  : 'Camera photo'}
            </Typography>
          </PreviewCard>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={!selectedImage}
          >
            Continue
          </Button>
        </Stack>
      </Container>
    </PageBox>
  )
}

export default UploadPhoto

