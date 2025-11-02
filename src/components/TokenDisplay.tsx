import { Box, Typography, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

const TokenPaper = styled(Paper)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
  borderRadius: 100,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}))

interface TokenDisplayProps {
  tokens: number
}

function TokenDisplay({ tokens }: TokenDisplayProps) {
  return (
    <TokenPaper>
      <Typography component="span" sx={{ fontSize: 18 }}>
        🪙
      </Typography>
      <Typography
        component="span"
        sx={{
          color: 'primary.main',
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {tokens}
      </Typography>
      <Typography
        component="span"
        sx={{
          color: 'text.secondary',
          fontSize: 12,
          fontWeight: 400,
        }}
      >
        Tokens
      </Typography>
    </TokenPaper>
  )
}

export default TokenDisplay

