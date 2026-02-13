import { Routes, Route } from 'react-router-dom'
import { Providers } from './app/Providers'
import { InvitationPage } from './pages/InvitationPage'

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<InvitationPage />} />
      </Routes>
    </Providers>
  )
}

export default App
