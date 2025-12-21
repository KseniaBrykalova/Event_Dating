import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { eventsService } from '../data/events'
import type { EventItem } from '../types/event'

interface EventsContextType {
  events: EventItem[]
  addEvent: (event: EventItem) => Promise<void>
  updateEvent: (id: string, updates: Partial<EventItem>) => void
  loading: boolean
  error: string | null
  refreshEvents: () => Promise<void>
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedEvents = await eventsService.getEvents()
      setEvents(fetchedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshEvents()
  }, [])

  const addEvent = async (event: EventItem) => {
    try {
      setError(null)
      
      // Получаем текущего пользователя из localStorage
      const currentUser = JSON.parse(localStorage.getItem('event_dating_current_user') || '{}')
      
      if (!currentUser.id) {
        throw new Error('Пользователь не авторизован')
      }
      
      await eventsService.createEvent({
        title: event.title,
        category: event.category,
        starts_at: event.startsAt,
        cover_variant: event.coverVariant,
        description: event.description,
        author_id: currentUser.id
      }, currentUser.email)
      
      await refreshEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
      throw err
    }
  }

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ))
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, loading, error, refreshEvents }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider')
  }
  return context
}
