type Filters = {
  gender: string
  ageRange: [number, number]
  interests: string[]
}

type Props = {
  filters: Filters
  onChange: (filters: Filters) => void
}

const INTERESTS = ['Спорт', 'Культура', 'Еда', 'Прогулка', 'Путешествия', 'Музыка', 'Кино', 'Игры']

function SwipeFilters({ filters, onChange }: Props) {
  const handleGenderChange = (gender: string) => {
    onChange({ ...filters, gender })
  }

  const handleAgeChange = (index: 0 | 1, value: string) => {
    const newAgeRange = [...filters.ageRange] as [number, number]
    newAgeRange[index] = parseInt(value) || 0
    onChange({ ...filters, ageRange: newAgeRange })
  }

  const toggleInterest = (interest: string) => {
    const newInterests = filters.interests.includes(interest)
      ? filters.interests.filter(i => i !== interest)
      : [...filters.interests, interest]
    onChange({ ...filters, interests: newInterests })
  }

  return (
    <div className="swipeFilters">
      <h3 className="swipeFilters__title">Фильтры</h3>
      
      <div className="swipeFilters__section">
        <label className="swipeFilters__label">Пол</label>
        <div className="swipeFilters__gender">
          {['Любой', 'Мужской', 'Женский'].map(g => (
            <button
              key={g}
              className={`swipeFilters__genderBtn ${filters.gender === g ? 'active' : ''}`}
              onClick={() => handleGenderChange(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="swipeFilters__section">
        <label className="swipeFilters__label">Возраст</label>
        <div className="swipeFilters__ageInputs">
          <input 
            type="number" 
            value={filters.ageRange[0]}
            min={18}
            onChange={(e) => handleAgeChange(0, e.target.value)}
            className="swipeFilters__input"
          />
          <span>-</span>
          <input 
            type="number" 
            value={filters.ageRange[1]}
            max={100}
            onChange={(e) => handleAgeChange(1, e.target.value)}
            className="swipeFilters__input"
          />
        </div>
      </div>

      <div className="swipeFilters__section">
        <label className="swipeFilters__label">Интересы</label>
        <div className="swipeFilters__tags">
          {INTERESTS.map(interest => (
            <button
              key={interest}
              className={`swipeFilters__tag ${filters.interests.includes(interest) ? 'active' : ''}`}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SwipeFilters
