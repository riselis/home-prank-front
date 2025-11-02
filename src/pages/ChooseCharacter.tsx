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
  Grid,
  TextField,
} from '@mui/material'
import { styled } from '@mui/material/styles'

const PageBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to bottom right, #F9F9FC, #FFFFFF)',
  minHeight: '100vh',
  padding: theme.spacing(3, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4, 2),
  },
}))

const CharacterCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 300ms ease-in-out',
  border: `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
  background: selected
    ? 'linear-gradient(to top right, rgba(123,92,255,0.1), rgba(195,155,255,0.1))'
    : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: theme.palette.primary.main,
  },
}))

interface Character {
  id: string
  name: string
  emoji: string
  description: string
}

const characters: Character[] = [
  {
    id: 'homeless',
    name: 'Homeless Person',
    emoji: '🧳',
    description: 'Realistic homeless person',
  },
  {
    id: 'plumber',
    name: 'Plumber',
    emoji: '🔧',
    description: 'A plumber fixing pipes',
  },
  {
    id: 'stranger',
    name: 'Stranger',
    emoji: '👤',
    description: 'Mysterious stranger',
  },
  {
    id: 'ghost',
    name: 'Ghost',
    emoji: '👻',
    description: 'Spooky ghost appearance',
  },
  {
    id: 'custom',
    name: 'Custom',
    emoji: '✏️',
    description: 'Type your own prompt',
  },
]

function ChooseCharacter() {
  const navigate = useNavigate()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')

  const handleCharacterSelect = (id: string) => {
    setSelectedCharacter(id)
  }

  const handleContinue = () => {
    if (selectedCharacter && (selectedCharacter !== 'custom' || customPrompt.trim())) {
      navigate('/action')
    }
  }

  return (
    <PageBox>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" gutterBottom>
            Choose Character Type
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Select the character you want to add to your room
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {characters.map((character) => (
            <Grid item xs={6} sm={4} md={3} key={character.id}>
              <CharacterCard
                selected={selectedCharacter === character.id}
                onClick={() => handleCharacterSelect(character.id)}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {character.emoji}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {character.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {character.description}
                  </Typography>
                </CardContent>
              </CharacterCard>
            </Grid>
          ))}
        </Grid>

        {selectedCharacter === 'custom' && (
          <Card sx={{ mb: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Enter Custom Character Prompt
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., A chef cooking pasta"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Card>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={() => navigate('/upload')}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={!selectedCharacter || (selectedCharacter === 'custom' && !customPrompt.trim())}
          >
            Continue
          </Button>
        </Stack>
      </Container>
    </PageBox>
  )
}

export default ChooseCharacter

