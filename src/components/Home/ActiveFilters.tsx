import type { EventCategory } from '../../types/event'

type Props = {
  dateFrom: string
  dateTo: string
  timeFrom: string
  timeTo: string
  category: EventCategory | ''
  interests: string
  onClearFilter: (filterType: string) => void
  onClearAll: () => void
}

function ActiveFilters({
  dateFrom,
  dateTo,
  timeFrom,
  timeTo,
  category,
  interests,
  onClearFilter,
  onClearAll,
}: Props) {
  const hasActiveFilters = dateFrom || dateTo || timeFrom || timeTo || category || interests

  if (!hasActiveFilters) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
  }

  const filters = []

  if (dateFrom) filters.push({ type: 'dateFrom', label: `От ${formatDate(dateFrom)}` })
  if (dateTo) filters.push({ type: 'dateTo', label: `До ${formatDate(dateTo)}` })
  if (timeFrom) filters.push({ type: 'timeFrom', label: `От ${timeFrom}` })
  if (timeTo) filters.push({ type: 'timeTo', label: `До ${timeTo}` })
  if (category) filters.push({ type: 'category', label: category })
  if (interests) filters.push({ type: 'interests', label: interests })

  return (
    <div className="active-filters">
      <div className="active-filters__list">
        {filters.map((filter) => (
          <span key={filter.type} className="active-filters__item">
            {filter.label}
            <button
              type="button"
              className="active-filters__remove"
              onClick={() => onClearFilter(filter.type)}
              aria-label={`Удалить фильтр ${filter.label}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <button
        type="button"
        className="active-filters__clear-all"
        onClick={onClearAll}
      >
        Очистить все
      </button>
    </div>
  )
}

export default ActiveFilters
