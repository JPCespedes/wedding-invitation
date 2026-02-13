import { motion } from 'framer-motion'
import { Hero } from '../components/Hero'
import { Countdown } from '../components/Countdown'
import { InvitedGuests } from '../components/InvitedGuests'
import { EventCard } from '../components/EventCard'
import { Gallery } from '../components/Gallery'
import { PartySection } from '../components/PartySection'
import { Footer } from '../components/Footer'
import { AudioGate } from '../components/AudioGate'
import { AudioControl } from '../components/AudioControl'
import { RsvpModal } from '../features/rsvp/RsvpModal'
import { invitationData } from '../data/invitation'

export function InvitationPage() {
  return (
    <>
      <AudioGate />
      <AudioControl />
      <RsvpModal />

      <main>
        <Hero />
        <div id="main-content">
          <Countdown />
          <InvitedGuests />
          <section id="events" className="py-16 px-6 bg-stone-100">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <motion.h2
                className="font-heading text-2xl md:text-3xl text-stone-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Será un día inolvidable y queremos vivirlo con vos.
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {invitationData.events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </section>
          <Gallery />
          <PartySection />
          <Footer />
        </div>
      </main>
    </>
  )
}
