# Invitación Digital de Boda — Modelo White

Invitación digital de boda inspirada en el modelo **White** de Fixdate. SPA con React, TypeScript, Vite y Tailwind CSS. RSVP mediante Google Forms (sin backend).

## Requisitos

- **Node.js 20+** (recomendado 20.19+ o 22.12+). Si usas `nvm`: `nvm use 20` o `nvm install 20`.

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Cómo cambiar el contenido

Todo el contenido editable está en **`src/data/invitation.ts`**:

- **`audioSrc`**: ruta del archivo de música de fondo (ej. `/audio/cant-help-falling-in-love.mp3`).
- **`couple`**: nombres de los novios, fecha (ISO), frase romántica.
- **`events`**: ceremonia y celebración (título, fecha/hora ISO, lugar, dirección, query para Google Maps).
- **`gallery`**: array de `{ id, src, alt }` para las fotos.
- **`gallerySubtitle`**: texto bajo el título de la galería.
- **`party`**: dress code (corto y largo), tips, texto para sugerir canción.
- **`gifts`**: texto para la sección de regalos (ej. datos bancarios).
- **`footer`**: hashtag, URL de Instagram, texto de compartir.
- **`googleForms`**: ver más abajo.

## Cómo reemplazar audio e imágenes

### Audio

- La ruta del audio se configura en **`src/data/invitation.ts`** con **`audioSrc`** (por defecto `/audio/cant-help-falling-in-love.mp3`).
- Coloca tu archivo de música en **`public/audio/`** con el nombre que uses (ej. `cant-help-falling-in-love.mp3`).
- Si no existe, el botón "Ingresar con música" seguirá funcionando; el reproductor no reproducirá nada (o fallará en silencio). Puedes usar cualquier MP3 para pruebas.

### Imágenes de la galería

- Por defecto las rutas son `/images/gallery-1.jpg`, …, `/images/gallery-6.jpg`. Coloca tus fotos en **`public/images/`** con esos nombres.
- O edita **`src/data/invitation.ts`** y cambia cada `src` por la URL que quieras (local o externa).
- Si una imagen no carga, se muestra un placeholder automáticamente.

## Cómo crear y conectar el Google Form (RSVP)

### 1. Crear el formulario

1. Entrá a [Google Forms](https://forms.google.com) y creá un formulario en blanco.
2. Añadí **exactamente estas preguntas** (el orden puede variar, pero necesitás estos tres campos):

   | Pregunta en el Form | Tipo de pregunta | Ejemplo de texto |
   |--------------------|------------------|-------------------|
   | **Nombres de quienes asisten** | Respuesta corta | "Nombre(s) de quienes asisten" |
   | **¿Asistirán?** | Opción múltiple (o lista desplegable) con opciones **Sí** y **No** | "¿Asistirán?" |
   | **Mensaje (alergias, restricciones)** | Párrafo (opcional) | "Mensaje: alergias o restricciones alimentarias por persona (opcional)" |

3. Opcional: en la pregunta "¿Asistirán?" podés poner solo las opciones **Sí** y **No** para que coincida con lo que envía la app.

### 2. Obtener el ID del formulario

1. Abrí el formulario en **modo edición** (no en "Vista previa").
2. Mirá la URL en el navegador. Se ve así:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSeXXXXXXXXXXXX/viewform
   ```
3. El **ID del formulario** es la parte entre `/d/e/` y `/viewform`. En el ejemplo sería: `1FAIpQLSeXXXXXXXXXXXX`. Copialo.

### 3. Obtener el ID de cada campo (entry.XXXXXX)

Cada pregunta del formulario tiene un ID interno (por ejemplo `entry.123456789`). Para obtenerlos:

1. Con el formulario abierto en **modo edición**, hacé clic en **Vista previa** (icono del ojo).
2. En la ventana de vista previa, **clic derecho → Inspeccionar** (o F12) para abrir las herramientas de desarrollador.
3. En la pestaña **Elements** (Elementos), usá la lupa o **Ctrl+F** y buscá `entry.`. Verás líneas como:
   ```html
   <input name="entry.123456789" ...>
   ```
4. Anotá el `entry.XXXXXX` que corresponde a cada pregunta (el valor de `name` del input o del textarea de esa pregunta). Repetí para las tres preguntas.

   **Tip:** Si no ves los inputs, expandí el `<form>` y los `<div>` hasta encontrar los que tengan `name="entry.XXXXXX"`. Cada pregunta suele tener un único `entry.XXXXXX`.

### 4. Conectar en la invitación

1. Abrí **`src/data/invitation.ts`**.
2. En el objeto **`googleForms`** reemplazá:
   - **`rsvpFormId`**: pegá el ID del formulario que copiaste en el paso 2.
   - **`fieldMap`**: reemplazá cada `entry.XXXXXX` por el ID real de esa pregunta:
     - **`name`** → el entry de "Nombres de quienes asisten".
     - **`attending`** → el entry de "¿Asistirán?".
     - **`message`** → el entry del mensaje (alergias/restricciones).

Ejemplo:

```ts
googleForms: {
  rsvpFormId: '1FAIpQLSeXXXXXXXXXXXX',  // tu ID real
  fieldMap: {
    name: 'entry.123456789',       // Nombres de quienes asisten
    attending: 'entry.987654321',  // ¿Asistirán?
    message: 'entry.555555555',    // Mensaje (alergias, etc.)
  },
  songFormUrl: 'https://docs.google.com/forms/d/TU_FORM_ID/viewform',
  songFieldEntry: 'entry.XXXXXX', // opcional, para pre-fill
},
```

### 5. Cómo funciona

- El invitado usa la web de la invitación con el link que incluye `?invitacion=CODIGO`, elige quiénes asisten y opcionalmente escribe el mensaje.
- Al hacer clic en **"Enviar y abrir formulario"**, la app arma una URL de Google Forms con esos datos ya cargados en la query string.
- Se abre esa URL en una nueva pestaña; el formulario aparece con los campos **Nombres**, **¿Asistirán?** y **Mensaje** rellenados.
- El invitado solo revisa y hace clic en **Enviar** en Google. Las respuestas se guardan en la pestaña **Respuestas** del Form o en la hoja de cálculo vinculada.

## Scripts

- `npm run dev` — desarrollo.
- `npm run build` — build de producción.
- `npm run preview` — previsualizar el build.
- `npm run lint` — ESLint.

## Estructura del proyecto

- `src/app/` — providers (Router, hidratación de estado).
- `src/components/` — AudioGate, Hero, Countdown, EventCard, Gallery, PartySection, Footer, AudioControl.
- `src/features/rsvp/` — RsvpModal, useGoogleFormSubmit, rsvpSchema (Zod).
- `src/data/invitation.ts` — datos de la invitación.
- `src/utils/` — calendarLinks (Google Calendar + ICS), mapLinks (Google Maps).
- `src/store/` — Zustand (audio, gate, modales).

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Router, Zustand, Framer Motion
- React Hook Form + Zod, Lucide-react, date-fns
- ESLint + Prettier
