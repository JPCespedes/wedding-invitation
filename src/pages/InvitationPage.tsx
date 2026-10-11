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
import { AccommodationSection } from '../components/AccommodationSection'
import { SectionDivider } from '../components/SectionDivider'
import { SectionHeading } from '../components/SectionHeading'
import { ScrollToTop } from '../components/ScrollToTop'
import { OrnamentDefs } from '../components/ornaments/OrnamentDefs'
import { FloralSpray } from '../components/ornaments/FloralSpray'
import { invitationData } from '../data/invitation'

export function InvitationPage() {
  return (
    <>
      {/* Shared gradient + watercolour filter every ornament references by id. */}
      <OrnamentDefs />

      <AudioGate />
      <AudioControl />
      <ScrollToTop />
      <RsvpModal />

      <main>
        <Hero />
        <div id="main-content">
          <Countdown />
          <InvitedGuests />

          <section
            id="events"
            className="relative py-16 sm:py-20 px-5 sm:px-6 bg-stone-100 overflow-hidden paper-grain"
          >
            <FloralSpray className="absolute -top-4 -left-8 w-40 sm:w-52" />

            <div className="relative">
              <SectionHeading
                title="Será un día inolvidable y queremos vivirlo con vos"
                face="serif"
                className="mb-10 sm:mb-12"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
                {invitationData.events.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            </div>
          </section>

          <AccommodationSection />
          <SectionDivider className="bg-terra-50" />
          <Gallery />
          <SectionDivider className="bg-stone-50" />
          <PartySection />
          <Footer />
        </div>
      </main>
    </>
  )
}
