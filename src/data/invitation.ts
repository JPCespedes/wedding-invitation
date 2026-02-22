const base = import.meta.env.BASE_URL

export const invitationData = {
  /**
   * Música de fondo al ingresar. Coloca el archivo en public/audio/
   * Ej: cant-help-falling-in-love.mp3
   */
  audioSrc: `${base}audio/el-poder-de-tu-amor.mp3`,
  couple: {
    groomName: 'Pablo',
    brideName: 'May',
    dateISO: '2027-01-29T15:00:00',
    quote:
      'A partir del 29 de enero de 2027 nuestras vidas se unen para siempre y queremos que nos acompañes en el inicio del nuevo camino.',
  },
  events: [
    {
      id: 'ceremonia',
      title: 'Ceremonia',
      datetimeISO: '2027-01-29T15:00:00',
      venueName: 'Parroquia Santa Ana',
      address: 'Santa Ana',
      mapsQuery: "9.9324436,-84.1805954"
    },
    {
      id: 'celebracion',
      title: 'Celebración',
      datetimeISO: '2027-01-29T17:30:00',
      venueName: 'El Rodeo Estancia',
      address: 'Belén',
      mapsQuery: "9.9767325,-84.199894"
    },
  ],
  gallery: [
    { id: '1', src: `${base}images/gallery-1.jpg`, alt: 'Retrato 1' },
    { id: '2', src: `${base}images/gallery-2.jpg`, alt: 'Retrato 2' },
    { id: '3', src: `${base}images/gallery-3.jpg`, alt: 'Retrato 3' },
    { id: '4', src: `${base}images/gallery-4.jpg`, alt: 'Retrato 4' },
    { id: '5', src: `${base}images/gallery-5.jpg`, alt: 'Retrato 5' },
    { id: '6', src: `${base}images/gallery-6.jpg`, alt: 'Retrato 6' },
  ],
  gallerySubtitle:
    'Un minuto, un segundo, un instante que queda en la eternidad',
  accommodation: {
    hotelName: 'El Rodeo Estancia Boutique Hotel',
    description:
      'El lugar de nuestra celebración cuenta con un hotel boutique familiar con más de 40 años de tradición, donde podrás hospedarte con tarifas preferenciales por ser nuestro invitado.',
    coupon: 'XXXXX',
    couponNote: 'Utilizá este cupón al reservar para obtener la tarifa preferencial. Los detalles del cupón serán compartidos próximamente.',
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
    dressCodeLong:
      'Elegante casual. Preferimos tonos claros y neutros. Evitar deportivo.',
    tips: [
      'Amamos a los pequeños de la familia, pero la celebración será exclusivamente para adultos. ¡Los niños son bienvenidos en la ceremonia!',
      'Contamos con servicio de descorche, así que si querés llevar tu bebida favorita para brindar, ¡adelante!',
      'El lugar dispone de estacionamiento para tu comodidad.',
      'El venue cuenta con un hotel boutique donde podrías hospedarte. ¡Consultá por tarifas especiales!',
    ],
    songPrompt:
      '¿Cuál es la canción que no debe faltar en la PlayList de la fiesta?',
  },
  gifts: {
    text: 'Si deseas regalarnos algo más que tu hermosa presencia, agradecemos contribuciones para nuestro hogar.\n\nCliente: JOSE PABLO CESPEDES CASTRO\nNúmero de cuenta BAC: 704133529\nNúmero de cuenta IBAN: CR91010200007041335293\nSinpe Móvil: 86443226',
    accountBAC: '704133529',
    accountIBAN: 'CR91010200007041335293',
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
   * Listas de invitados por código. Compartí el link con ?invitacion=CODIGO
   * Ej: tusitio.com?invitacion=garcia → muestra la lista "garcia"
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
