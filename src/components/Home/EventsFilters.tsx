import type { EventCategory } from '../../types/event'

type Props = {
  dateFrom: string
  dateTo: string
  timeFrom: string
  timeTo: string
  category: EventCategory | ''
  interests: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onTimeFromChange: (value: string) => void
  onTimeToChange: (value: string) => void
  onCategoryChange: (value: EventCategory | '') => void
  onInterestsChange: (value: string) => void
  onClear: () => void
  onDone: () => void
}

function EventsFilters({
  dateFrom,
  dateTo,
  timeFrom,
  timeTo,
  category,
  interests,
  onDateFromChange,
  onDateToChange,
  onTimeFromChange,
  onTimeToChange,
  onCategoryChange,
  onInterestsChange,
  onClear,
  onDone,
}: Props) {
  return (
    <div className="filters">
      <div className="filters__grid">
        <label className="field">
          <span className="label">Дата от</span>
          <input value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className="input" type="date" />
        </label>

        <label className="field">
          <span className="label">Дата до</span>
          <input value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className="input" type="date" />
        </label>

        <label className="field">
          <span className="label">Время от</span>
          <input value={timeFrom} onChange={(e) => onTimeFromChange(e.target.value)} className="input" type="time" />
        </label>

        <label className="field">
          <span className="label">Время до</span>
          <input value={timeTo} onChange={(e) => onTimeToChange(e.target.value)} className="input" type="time" />
        </label>

        <label className="field">
          <span className="label">Категория</span>
          <select value={category} onChange={(e) => onCategoryChange(e.target.value as EventCategory | '')} className="input">
            <option value="">Любая</option>
            <option value="Спорт">Спорт</option>
            <option value="Культура">Культура</option>
            <option value="Еда">Еда</option>
            <option value="Прогулка">Прогулка</option>
            <option value="Другое">Другое</option>
          </select>
        </label>

        <label className="field field--wide">
          <span className="label">Интересы</span>
          <input
            value={interests}
            onChange={(e) => onInterestsChange(e.target.value)}
            className="input"
            placeholder="Например: кино, бег, кофе"
          />
        </label>
      </div>

      <div className="filters__actions">
        <button type="button" className="button button--ghost" onClick={onClear}>
          Сбросить
        </button>
        <button type="button" className="button" onClick={onDone}>
          Готово
        </button>
      </div>
    </div>
  )
}

export default EventsFilters
