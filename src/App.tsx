import { Routes, Route, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import UploadPhoto from './pages/UploadPhoto'
import ChooseCharacter from './pages/ChooseCharacter'
import ChooseAction from './pages/ChooseAction'
import GenerateImage from './pages/GenerateImage'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import PricingPage from './pages/Pricing'

function App() {
  const location = useLocation()
  const hideNavBar = location.pathname === '/signin' || location.pathname === '/signup'

  return (
    <Box>
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPhoto />} />
        <Route path="/character" element={<ChooseCharacter />} />
        <Route path="/action" element={<ChooseAction />} />
        <Route path="/generate" element={<GenerateImage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Box>
  )
}

export default App
