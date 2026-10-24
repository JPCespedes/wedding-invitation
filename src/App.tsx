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
        {/* El código de invitación como ruta: «/cami-andres». Va al final, pero
            el orden no decide nada: react-router prefiere siempre el segmento
            fijo, así que «/admin» gana sin que haya que excluirlo aquí. */}
        <Route path="/:codigo" element={<InvitationPage />} />
      </Routes>
    </Providers>
  )
}

export default App
