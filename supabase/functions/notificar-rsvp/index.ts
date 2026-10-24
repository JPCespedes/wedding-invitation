/**
 * Avisa por correo cada vez que alguien confirma su asistencia o cambia una
 * respuesta ya dada.
 *
 * La dispara un webhook de la base sobre `rsvp_confirmations` (INSERT y
 * UPDATE), no el navegador. Por eso el aviso sale igual si responde el
 * invitado desde su link o si se corrige la respuesta desde el panel: ambas
 * cosas terminan escribiendo en la misma tabla.
 */

interface Guest {
  name: string
  attending: boolean
  message?: string
}

interface Payload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  record: {
    invitation_code: string | null
    guests: Guest[]
  } | null
  old_record: {
    guests?: Guest[]
  } | null
}

// Para agregar a May cuando haya dominio verificado en Resend, basta con
// sumarla acá. Con el dominio de pruebas solo llega a la cuenta de Resend.
const DESTINATARIOS = ['pablo.cespedc@gmail.com']
const REMITENTE = 'Invitación May & Pablo <onboarding@resend.dev>'

const escapar = (texto: string) =>
  texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function listaHtml(personas: Guest[], vacia: string): string {
  if (personas.length === 0) return `<p style="color:#8c8279;margin:4px 0">${vacia}</p>`

  return `<ul style="margin:4px 0;padding-left:18px">${personas
    .map((p) => {
      const nota = p.message?.trim()
      const detalle = nota
        ? ` — <span style="color:#AD5531">${escapar(nota)}</span>`
        : ''
      return `<li style="margin:2px 0">${escapar(p.name)}${detalle}</li>`
    })
    .join('')}</ul>`
}

Deno.serve(async (req: Request): Promise<Response> => {
  // El endpoint es público, así que se exige un secreto compartido que el
  // trigger manda en la cabecera. Sin esto, cualquiera podría llenar de
  // avisos falsos la bandeja de entrada.
  const secreto = Deno.env.get('RSVP_WEBHOOK_SECRET')
  if (!secreto || req.headers.get('x-webhook-secret') !== secreto) {
    return new Response('No autorizado', { status: 401 })
  }

  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    console.error('Falta el secreto RESEND_API_KEY')
    return new Response('Falta RESEND_API_KEY', { status: 500 })
  }

  const payload = (await req.json()) as Payload
  const registro = payload.record
  if (!registro) {
    return new Response('Sin registro que notificar', { status: 200 })
  }

  const codigo = registro.invitation_code ?? '(sin código)'
  const invitados = registro.guests ?? []
  const asisten = invitados.filter((g) => g.attending)
  const noAsisten = invitados.filter((g) => !g.attending)
  const esCambio = payload.type === 'UPDATE'

  const resumen = `${asisten.length} de ${invitados.length} asisten`
  const asunto = esCambio
    ? `Respuesta actualizada · ${codigo} · ${resumen}`
    : `Nueva confirmación · ${codigo} · ${resumen}`

  // En una modificación, lo primero que uno quiere saber es qué cambió.
  let comparacion = ''
  if (esCambio && payload.old_record?.guests) {
    const antes = payload.old_record.guests.filter((g) => g.attending).length
    comparacion = `<p style="color:#8c8279;margin:0 0 12px">Antes asistían ${antes} de ${payload.old_record.guests.length}.</p>`
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;color:#2b2a2c">
      <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8c8279;margin:0 0 4px">
        ${esCambio ? 'Respuesta actualizada' : 'Nueva confirmación'}
      </p>
      <h2 style="margin:0 0 2px;font-size:20px">${escapar(codigo)}</h2>
      <p style="margin:0 0 12px;color:#203E5C;font-weight:600">${resumen}</p>
      ${comparacion}

      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#8c8279;margin:16px 0 0">Asisten</h3>
      ${listaHtml(asisten, 'Nadie de esta invitación asiste.')}

      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#8c8279;margin:16px 0 0">No asisten</h3>
      ${listaHtml(noAsisten, 'Nadie marcó que no asiste.')}

      <p style="margin:20px 0 0;font-size:12px;color:#a8a29e">
        Las restricciones alimentarias salen en rojo junto a cada persona.
      </p>
    </div>
  `

  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: REMITENTE,
      to: DESTINATARIOS,
      subject: asunto,
      html,
    }),
  })

  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    console.error('Resend rechazó el envío:', respuesta.status, detalle)
    // Se responde 200 igual: un fallo de correo no debe hacer que la base
    // reintente ni que el invitado vea un error al confirmar.
    return new Response(`Correo no enviado: ${detalle}`, { status: 200 })
  }

  console.log(`Aviso enviado para ${codigo} (${payload.type})`)
  return new Response('Aviso enviado', { status: 200 })
})
