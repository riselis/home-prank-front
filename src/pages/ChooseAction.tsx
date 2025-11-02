import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
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

const ActionCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 300ms ease-in-out',
  border: `2px solid ${selected ? theme.palette.primary.main : '#E0E0E0'}`,
  background: selected
    ? 'linear-gradient(to top right, rgba(123,92,255,0.1), rgba(195,155,255,0.1))'
    : theme.palette.background.paper,
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: theme.palette.primary.main,
    boxShadow: '0 4px 12px rgba(123,92,255,0.15)',
  },
}))

interface Action {
  id: string
  name: string
  emoji: string
}

const actions: Action[] = [
  { id: 'sitting', name: 'Sitting', emoji: '🪑' },
  { id: 'sleeping', name: 'Sleeping', emoji: '😴' },
  { id: 'standing', name: 'Standing near window', emoji: '🪟' },
  { id: 'cooking', name: 'Cooking', emoji: '👨‍🍳' },
  { id: 'reading', name: 'Reading', emoji: '📖' },
  { id: 'watching', name: 'Watching TV', emoji: '📺' },
]

function ChooseAction() {
  const navigate = useNavigate()
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const handleActionSelect = (id: string) => {
    setSelectedAction(id)
  }

  const handleGenerate = () => {
    if (selectedAction) {
      GenerationStore.setAction({ id: selectedAction })
      navigate('/generate')
    }
  }

  return (
    <PageBox>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" gutterBottom>
            Choose Action
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Select what the character should be doing
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {actions.map((action) => (
            <Grid item xs={6} sm={4} md={4} key={action.id}>
              <ActionCard
                selected={selectedAction === action.id}
                onClick={() => handleActionSelect(action.id)}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {action.emoji}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {action.name}
                  </Typography>
                </CardContent>
              </ActionCard>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={() => navigate('/character')}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={!selectedAction}
            sx={{ minWidth: 200 }}
          >
            Generate Image
          </Button>
        </Stack>
      </Container>
    </PageBox>
  )
}

export default ChooseAction

