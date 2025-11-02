import { Grid, Card, Typography, Button, Box, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  position: 'relative',
  transition: 'all 300ms ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}))

const PopularCard = styled(StyledCard)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
  transform: 'scale(1.05)',
}))

const PriceChip = styled(Chip)({
  position: 'absolute',
  top: -12,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(to top right, #7B5CFF, #C39BFF)',
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: 12,
})

interface PricingPackage {
  id: string
  tokens: number
  price: number
  popular?: boolean
}

interface PricingProps {
  packages: PricingPackage[]
  onSelect: (pkg: PricingPackage) => void
}

function Pricing({ packages, onSelect }: PricingProps) {
  return (
    <Grid container spacing={2}>
      {packages.map((pkg) => {
        const CardComponent = pkg.popular ? PopularCard : StyledCard
        return (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <CardComponent>
              {pkg.popular && (
                <PriceChip label="Popular" size="small" />
              )}
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                {pkg.tokens} Tokens
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                ${pkg.price}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                ${(pkg.price / pkg.tokens).toFixed(3)} per token
              </Typography>
              <Button
                variant={pkg.popular ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => onSelect(pkg)}
              >
                Buy Now
              </Button>
            </CardComponent>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default Pricing

