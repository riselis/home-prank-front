import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import UploadPhoto from './pages/UploadPhoto'
import ChooseCharacter from './pages/ChooseCharacter'
import ChooseAction from './pages/ChooseAction'
import GenerateImage from './pages/GenerateImage'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import PricingPage from './pages/Pricing'

function App() {
  return (
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
  )
}

export default App
