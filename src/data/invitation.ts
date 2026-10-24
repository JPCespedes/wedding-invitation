const base = import.meta.env.BASE_URL

export const invitationData = {
  /**
   * Música de fondo al ingresar. Coloca el archivo en public/audio/
   * Ej: cant-help-falling-in-love.mp3
   */
  audioSrc: `${base}audio/el-poder-de-tu-amor.mp3`,
  /**
   * Los campos guardan quién es quién, pero el orden de lectura es el
   * contrario: en todo el sitio el nombre de la novia va primero, «May &
   * Pablo». Vale para la portada, la pantalla de bienvenida, el cierre, el
   * título de la pestaña, los eventos de calendario y el panel.
   */
  couple: {
    groomName: 'Pablo',
    brideName: 'May',
    dateISO: '2027-01-29T14:30:00',
    quote:
      'A partir del 29 de enero de 2027 nuestras vidas se unen para siempre y queremos que nos acompañés en el inicio del nuevo camino.',
  },
  /**
   * Fecha límite para confirmar. Se muestra junto al botón, dentro del
   * formulario y en las preguntas frecuentes, pero no se hace cumplir: el
   * sitio sigue aceptando respuestas después, porque más vale una
   * confirmación tardía que ninguna.
   */
  rsvpDeadline: '20 de diciembre',
  events: [
    {
      id: 'ceremonia',
      title: 'Ceremonia',
      datetimeISO: '2027-01-29T14:30:00',
      durationHours: 2,
      venueName: 'Parroquia Santa Ana',
      address: 'Santa Ana',
      mapsQuery: "9.9324436,-84.1805954"
    },
    {
      id: 'celebracion',
      title: 'Celebración',
      datetimeISO: '2027-01-29T17:30:00',
      // De 5:30 p.m. a 10:30 p.m.: es lo que el invitado bloquea en su agenda.
      durationHours: 5,
      venueName: 'El Rodeo Estancia',
      address: 'Belén',
      mapsQuery: "9.9767325,-84.199894"
    },
  ],
  /**
   * Portada. El video va sin sonido y en bucle; el póster es su primer
   * fotograma y es lo que se ve mientras carga (y si el video falla).
   * El original venía en HEVC, que no reproducen la mayoría de navegadores:
   * public/video/hero.mp4 es el mismo clip en H.264 540×960.
   */
  heroVideo: {
    src: `${base}video/hero.mp4`,
    poster: `${base}video/hero-poster.jpg`,
  },
  heroImage: `${base}images/RLR_6587.jpg`,
  gallery: [
    { id: '1', src: `${base}images/RLR_6612.jpg`, alt: 'Retrato 1' },
    { id: '2', src: `${base}images/RLR_6546.jpg`, alt: 'Retrato 2' },
    { id: '3', src: `${base}images/RLR_6386.jpg`, alt: 'Retrato 3' },
    { id: '4', src: `${base}images/RLR_6201.jpg`, alt: 'Retrato 4' },
    { id: '5', src: `${base}images/RLR_6093.jpg`, alt: 'Retrato 5' },
    { id: '6', src: `${base}images/RLR_5844.jpg`, alt: 'Retrato 6' },
    { id: '7', src: `${base}images/RLR_5788.jpg`, alt: 'Retrato 7' },
    { id: '8', src: `${base}images/RLR_5725.jpg`, alt: 'Retrato 8' },
    { id: '9', src: `${base}images/RLR_5684.jpg`, alt: 'Retrato 9' },
    { id: '10', src: `${base}images/RLR_5643.jpg`, alt: 'Retrato 10' },
  ],
  gallerySubtitle:
    'Un minuto, un segundo, un instante que queda en la eternidad',
  accommodation: {
    hotelName: 'El Rodeo Estancia Boutique Hotel',
    description:
      'El lugar de nuestra celebración cuenta con un hotel boutique familiar con más de 40 años de tradición, donde podrás hospedarte con tarifas preferenciales por ser nuestro invitado.',
    coupon: '#37459',
    couponNote: 'Utilizá este cupón al reservar para obtener la tarifa preferencial.',
    phone: '+506 2293-3909',
    email: 'info@elrodeohotel.com',
    bookingUrl: 'https://elrodeohotel.com/rooms.html',
    address: 'Costado Suroeste de la Panasonic, Cruce Belén - Santa Ana',
    amenities: ['Desayuno incluido', 'WiFi', 'Parqueo gratuito', 'Piscina', 'Gimnasio', 'Restaurante'],
    rooms: [
      {
        name: 'Deluxe',
        rates: [
          { occupancy: 'Sencilla / Doble', price: '$79.65' },
          { occupancy: 'Triple', price: '$97.35' },
          { occupancy: 'Cuádruple', price: '$115.06' },
        ],
      },
      {
        name: 'Jr. Suite',
        rates: [
          { occupancy: 'Sencilla / Doble', price: '$97.34' },
          { occupancy: 'Triple', price: '$115.05' },
          { occupancy: 'Cuádruple', price: '$132.75' },
        ],
      },
      {
        name: 'Suite',
        rates: [
          { occupancy: 'Sencilla / Doble', price: '$119.65' },
        ],
      },
    ],
    reservationNote: 'Para reservar, contactá al hotel indicando la fecha del evento, nombre de los novios, fecha de ingreso, categoría de habitación y cantidad de huéspedes.',
    policyNote: 'Tarifas por habitación por noche, no incluyen impuesto de ley (13%). Check in: 3:00 p.m. / Check out: 12:00 m.d.',
  },
  party: {
    dressCodeShort: 'Una orientación para tu vestuario',
    /**
     * Lo que abre «Ver más» en la tarjeta de Dress Code. La paleta copia el
     * moodboard: los hex se midieron sobre sus círculos, así que si cambia la
     * imagen hay que volver a medirlos. La excepción es el azul denim, que usa
     * el azul oficial de la boda (stone-800 en index.css) y no el del moodboard.
     */
    dressCode: {
      style: 'Elegante casual',
      paletteIntro:
        'Nos encantaría que nos acompañen con algún detalle de vestimenta en los tonos de nuestra paleta de colores.',
      palette: [
        { name: 'Terracota', hex: '#AF5632' },
        { name: 'Azul denim', hex: '#203E5C' },
        { name: 'Azul grisáceo', hex: '#798EA1' },
        { name: 'Verde oliva', hex: '#5A593D' },
        { name: 'Verde salvia', hex: '#7E7C63' },
        { name: 'Mostaza', hex: '#BB813E' },
        { name: 'Rosa empolvado', hex: '#BB7E73' },
        { name: 'Lila', hex: '#A17B8A' },
        { name: 'Taupe', hex: '#8C7666' },
      ],
      /**
       * Cada fila lleva un círculo tachado: `swatches` pinta uno o dos colores
       * (dos se dibujan como círculos superpuestos), `icon` un dibujo.
       */
      avoid: [
        {
          title: 'Blanco y tonos parecidos',
          detail: 'Marfil, crema o hueso: esos los reservamos para la novia.',
          swatches: ['#FFFFFF'],
        },
        {
          title: 'Vestidos rojos o negros',
          detail: 'Para ellas, mejor algún tono de la paleta.',
          swatches: ['#B3262D', '#2B2A2C'],
        },
        {
          title: 'Ropa deportiva y tenis',
          detail: 'Es una celebración elegante, ¡aprovechá para lucirte!',
          icon: 'sneaker',
        },
      ],
      moodboard: {
        src: `${base}images/dress-code-moodboard.jpg`,
        alt: 'Moodboard de vestimenta: vestidos y trajes en terracota, azul, verde, mostaza, rosa, lila y taupe, con flores y mesas de referencia.',
        width: 1536,
        height: 1024,
      },
      /**
       * Tablero público de Pinterest (a esta dirección lleva https://pin.it/1JjXCs8U6).
       * Ojo: el link de «Invitar colaboradores» también es un pin.it, pero deja a
       * quien lo abra editar el tablero. Si queda vacío, el botón dice «muy pronto».
       */
      pinterestUrl: 'https://www.pinterest.com/maylida/wedding-color/',
    },
    tips: [
      'Amamos a los pequeños de la familia, pero la celebración será exclusivamente para adultos. ¡Los niños son bienvenidos en la ceremonia!',
      'Contamos con servicio de descorche, así que si querés llevar tu bebida favorita para brindar, ¡adelante!',
      'El lugar dispone de estacionamiento para tu comodidad.',
      'El lugar cuenta con un hotel boutique donde podrías hospedarte. ¡Consultá por tarifas especiales!',
    ],
    songPrompt:
      '¿Cuál es la canción que no debe faltar en la playlist de la fiesta?',
  },
  gifts: {
    text: 'Si deseas regalarnos algo más que tu hermosa presencia, agradecemos contribuciones para nuestro hogar.\n\nCliente: JOSE PABLO CESPEDES CASTRO\nColones\nNúmero de cuenta BAC: 704133529\nNúmero de cuenta IBAN: CR91010200007041335293\n\nDólares\nNúmero de cuenta BAC: 704133222\nNúmero de cuenta IBAN: CR89010200007041332225\n\nSinpe Móvil: 86443226',
    holder: 'José Pablo Céspedes Castro',
    bank: 'Banco BAC',
    accountBAC: '704133529',
    accountIBAN: 'CR91010200007041335293',
    accountBACUsd: '704133222',
    accountIBANUsd: 'CR89010200007041332225',
    sinpeMovil: '86443226',
  },
  googleForms: {
    rsvpFormId: '1FAIpQLSf8LV94M8VTLRdqgV7EBOo-dCg9bQJU7qNlwVZ1zD0WTci0dA',
    fieldMap: {
      name: 'entry.2105991780',  // Nombres de quienes asisten
      message: 'entry.864492237', // Mensaje (alergias, restricciones)
    },
    songFormUrl:
      'https://docs.google.com/forms/d/1ib0R7mmqcU82VGngW16Gmcq82UASYZlaEDOFwd2S_DU/viewform',
    songFieldEntry: 'entry.71187672', // Para pre-fill si se usa en el futuro
  },
  /**
   * Listas de invitados por código. Compartí el link con el código en la ruta.
   * Ej: tusitio.com/garcia → muestra la lista "garcia"
   * También sigue funcionando el formato viejo, tusitio.com?invitacion=garcia.
   */
  guestLists: {
    garcia: {
      totalCount: 3,
      guests: ['Juan García', 'Sofía García', 'Mateo García'],
      message:
        'Tu presencia es lo más importante. ¡No faltes!',
    },
    // Añadí más códigos según necesites:
    // ramirez: { totalCount: 2, guests: ['...'], message: '...' },
  },
} as const

export type EventId = (typeof invitationData.events)[number]['id']
