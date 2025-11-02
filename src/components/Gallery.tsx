import { Card, CardMedia, Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)({
  overflow: 'hidden',
  padding: 0,
  transition: 'transform 300ms ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
})

interface GalleryItem {
  id: string
  image: string
  caption: string
}

interface GalleryProps {
  items: GalleryItem[]
}

function Gallery({ items }: GalleryProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 300px)' },
        gap: 2,
        justifyContent: 'center',
      }}
    >
      {items.map((item) => (
        <Box key={item.id}>
          <StyledCard
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: { xs: '100%', md: 300 },
              height: { xs: 'auto', md: 400 },
            }}
          >
            <CardMedia
              component="img"
              image={item.image}
              alt={item.caption}
              sx={{
                width: '100%',
                height: { xs: 'auto', md: 300 },
                aspectRatio: { xs: '1', md: 'auto' },
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, textAlign: 'center' }}
              >
                {item.caption}
              </Typography>
            </Box>
          </StyledCard>
        </Box>
      ))}
    </Box>
  )
}

export default Gallery

