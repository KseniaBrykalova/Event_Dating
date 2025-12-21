import { useMemo, useState } from 'react'
import ActiveFilters from '../components/Home/ActiveFilters'
import EventsFilters from '../components/Home/EventsFilters'
import EventsSection from '../components/Home/EventsSection'
import EventsToolbar from '../components/Home/EventsToolbar'
import { useEvents } from '../context/EventsContext'
import type { EventCategory } from '../types/event'

function HomePage() {
  const { events: allEvents } = useEvents()
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [timeFrom, setTimeFrom] = useState('')
  const [timeTo, setTimeTo] = useState('')
  const [category, setCategory] = useState<EventCategory | ''>('')
  const [interests, setInterests] = useState('')

  const events = useMemo(() => {
    const q = query.trim().toLowerCase()

    return allEvents.filter((e) => {
      if (q && !e.title.toLowerCase().includes(q)) return false

      if (category && e.category !== category) return false

      const dt = new Date(e.startsAt)

      if (dateFrom) {
        const d0 = new Date(`${dateFrom}T00:00`)
        if (dt < d0) return false
      }

      if (dateTo) {
        const d1 = new Date(`${dateTo}T23:59`)
        if (dt > d1) return false
      }

      if (timeFrom || timeTo) {
        const hhmm = dt.toTimeString().slice(0, 5)
        if (timeFrom && hhmm < timeFrom) return false
        if (timeTo && hhmm > timeTo) return false
      }

      if (interests.trim()) {
        const parts = interests
          .split(',')
          .map((p) => p.trim().toLowerCase())
          .filter(Boolean)

        if (parts.length > 0) {
          const hay = `${e.title} ${e.category}`.toLowerCase()
          const ok = parts.some((p) => hay.includes(p))
          if (!ok) return false
        }
      }

      return true
    })
  }, [allEvents, category, dateFrom, dateTo, interests, query, timeFrom, timeTo])

  const clearFilters = () => {
    setDateFrom('')
    setDateTo('')
    setTimeFrom('')
    setTimeTo('')
    setCategory('')
    setInterests('')
  }

  const clearSingleFilter = (filterType: string) => {
    switch (filterType) {
      case 'dateFrom':
        setDateFrom('')
        break
      case 'dateTo':
        setDateTo('')
        break
      case 'timeFrom':
        setTimeFrom('')
        break
      case 'timeTo':
        setTimeTo('')
        break
      case 'category':
        setCategory('')
        break
      case 'interests':
        setInterests('')
        break
    }
  }

  return (
    <div className="container">
      <section className="hero">
        <div className="hero__text">
          <h1 className="h1">Мероприятия</h1>
          <p className="muted">Найди событие по интересам и познакомься вживую.</p>
        </div>

        <EventsToolbar
          query={query}
          onQueryChange={setQuery}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((v) => !v)}
        />

        {filtersOpen && (
          <EventsFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            timeFrom={timeFrom}
            timeTo={timeTo}
            category={category}
            interests={interests}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onTimeFromChange={setTimeFrom}
            onTimeToChange={setTimeTo}
            onCategoryChange={setCategory}
            onInterestsChange={setInterests}
            onClear={clearFilters}
            onDone={() => setFiltersOpen(false)}
          />
        )}

        {!filtersOpen && (
          <ActiveFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            timeFrom={timeFrom}
            timeTo={timeTo}
            category={category}
            interests={interests}
            onClearFilter={clearSingleFilter}
            onClearAll={clearFilters}
          />
        )}
      </section>

      <EventsSection events={events} />
    </div>
  )
}

export default HomePage
