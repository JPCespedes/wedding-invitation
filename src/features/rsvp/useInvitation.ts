import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export interface InvitationData {
  guests: string[]
  message: string
}

export function useInvitation(code: string | null | undefined) {
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return

    setIsLoading(true)
    setError(null)

    supabase
      .from('invitations')
      .select('guests, message')
      .eq('code', code)
      .maybeSingle()
      .then(({ data, error: err }) => {
        setIsLoading(false)
        if (err) {
          setError(err.message)
          return
        }
        if (data) {
          setInvitation({
            guests: data.guests as string[],
            message: (data.message as string) ?? '',
          })
        } else {
          setInvitation(null)
        }
      })
  }, [code])

  return { invitation, isLoading, error }
}
