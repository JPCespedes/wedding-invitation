# Aviso por correo de confirmaciones

Manda un correo cada vez que alguien confirma su asistencia o cambia una
respuesta ya dada.

El disparo viene de la base, no del navegador: un webhook sobre
`rsvp_confirmations` (INSERT y UPDATE). Por eso el aviso sale igual si responde
el invitado desde su link o si se corrige la respuesta desde el panel — ambas
cosas terminan escribiendo en la misma tabla.

## Puesta en marcha

Son cuatro pasos y solo hay que hacerlos una vez.

### 1. Cuenta en Resend

Crear la cuenta en [resend.com](https://resend.com) **con pablo.cespedc@gmail.com**
y copiar una API key desde *API Keys*.

Eso de la dirección no es un detalle: mientras el remitente sea el dominio de
pruebas `onboarding@resend.dev`, Resend solo entrega correos a la dirección con
la que se abrió la cuenta. Cualquier otro destinatario rebota con 403.

### 2. Secretos en Supabase

En *Edge Functions → Secrets* del proyecto `kfytsatvnqrcwiavplib`:

| Secreto | Valor |
| --- | --- |
| `RESEND_API_KEY` | la API key del paso 1 |
| `RSVP_WEBHOOK_SECRET` | una cadena aleatoria, por ejemplo la de `openssl rand -hex 24` |

El segundo existe porque la función se publica sin exigir JWT, para que el
trigger pueda llamarla. Sin un secreto compartido, cualquiera que diera con la
URL podría llenar la bandeja de entrada de avisos falsos.

### 3. Publicar la función

```bash
npx supabase functions deploy notificar-rsvp \
  --project-ref kfytsatvnqrcwiavplib \
  --no-verify-jwt
```

### 4. Crear el webhook

Lo más cómodo es por el panel, en *Database → Webhooks → Create a new hook*:

- **Table:** `rsvp_confirmations`
- **Events:** `Insert` y `Update`
- **Type:** Supabase Edge Functions → `notificar-rsvp`
- **HTTP Headers:** agregar `x-webhook-secret` con el mismo valor del paso 2

El equivalente en SQL, por si se prefiere, sustituyendo el secreto:

```sql
create trigger avisar_rsvp
  after insert or update on public.rsvp_confirmations
  for each row
  execute function supabase_functions.http_request(
    'https://kfytsatvnqrcwiavplib.supabase.co/functions/v1/notificar-rsvp',
    'POST',
    '{"Content-Type":"application/json","x-webhook-secret":"EL_SECRETO_DEL_PASO_2"}',
    '{}',
    '5000'
  );
```

## Comprobar que funciona

Abrir cualquier invitación, confirmar, y revisar la bandeja. Si no llega, el
log está en *Edge Functions → notificar-rsvp → Logs*; la función deja escrito
ahí tanto el envío correcto como el motivo del rechazo de Resend.

## Agregar a May

Cuando haya un dominio propio verificado en Resend:

1. Cambiar `REMITENTE` en `index.ts` a una dirección de ese dominio.
2. Sumar `mayvaguilar14@gmail.com` a `DESTINATARIOS`.
3. Volver a publicar la función.

Hasta entonces el dominio de pruebas no entrega a nadie más que a la cuenta.

## Decisiones

**Un fallo de correo no rompe la confirmación.** Si Resend rechaza el envío, la
función responde 200 igual y deja el motivo en el log. Devolver un error haría
que la base reintentara, y en el peor caso que el invitado viera algo roto al
confirmar — cuando su respuesta sí se guardó.

**El correo dice qué cambió.** En una modificación incluye cuántos asistían
antes, porque es lo primero que uno quiere saber al abrirlo.
