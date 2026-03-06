import { Routes, Route } from 'react-router-dom'
import { Providers } from './app/Providers'
import { InvitationPage } from './pages/InvitationPage'
import { AdminPage } from './pages/AdminPage'

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<InvitationPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Providers>
  )
}

export default App
