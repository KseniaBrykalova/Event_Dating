import type { EventItem } from '../../types/event'
import EventCard from '../Events/EventCard'

type Props = {
  events: EventItem[]
}

function EventsSection({ events }: Props) {
  return (
    <section className="section">
      <div className="section__header">
        <h2 className="h2">Секция мероприятий</h2>
        <div className="pill" aria-label="Количество мероприятий">
          {events.length}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty">
          <div className="empty__title">Ничего не найдено</div>
          <div className="empty__text">Попробуй изменить поиск или фильтры.</div>
        </div>
      ) : (
        <div className="grid">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </section>
  )
}

export default EventsSection
