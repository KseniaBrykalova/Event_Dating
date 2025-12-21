import type { EventItem } from '../types/event'

export const mockEvents: EventItem[] = [
  {
    id: '1',
    title: 'Утренняя прогулка по парку',
    category: 'Прогулка',
    startsAt: '2025-12-21T10:30',
    coverVariant: 'mint',
  },
  {
    id: '2',
    title: 'Кофе и разговоры в центре',
    category: 'Еда',
    startsAt: '2025-12-21T16:00',
    coverVariant: 'peach',
  },
  {
    id: '3',
    title: 'Лёгкая тренировка на свежем воздухе',
    category: 'Спорт',
    startsAt: '2025-12-22T18:30',
    coverVariant: 'sky',
  },
  {
    id: '4',
    title: 'Мини-выставка: современная фотография',
    category: 'Культура',
    startsAt: '2025-12-23T19:00',
    coverVariant: 'lavender',
  },
]
