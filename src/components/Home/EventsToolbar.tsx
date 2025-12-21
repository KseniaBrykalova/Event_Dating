type Props = {
  query: string
  onQueryChange: (value: string) => void
  filtersOpen: boolean
  onToggleFilters: () => void
}

function EventsToolbar({ query, onQueryChange, filtersOpen, onToggleFilters }: Props) {
  return (
    <div className="toolbar">
      <div className="search">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="input input--lg"
          placeholder="Поиск мероприятий"
          aria-label="Поиск мероприятий"
        />
      </div>

      <button
        type="button"
        className={filtersOpen ? 'button button--secondary button--active' : 'button button--secondary'}
        onClick={onToggleFilters}
        aria-expanded={filtersOpen}
      >
        Фильтры
      </button>
    </div>
  )
}

export default EventsToolbar
