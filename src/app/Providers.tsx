import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrateFromStorage = useAppStore((s) => s.hydrateFromStorage)

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  return <BrowserRouter basename="/wedding-invitation">{children}</BrowserRouter>
}
