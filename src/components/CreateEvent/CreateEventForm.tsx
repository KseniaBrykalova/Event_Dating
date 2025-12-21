import { useEffect, useState, type ChangeEvent } from 'react'
import type { EventCategory } from '../../types/event'

type Props = {
  onSave?: (payload: { title: string; startsAt: string; coverFileName: string | null; category: EventCategory }) => void
}

const categories: EventCategory[] = ['Спорт', 'Культура', 'Еда', 'Прогулка', 'Другое']

function CreateEventForm({ onSave }: Props) {
  const [title, setTitle] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [category, setCategory] = useState<EventCategory>('Другое')
  const [coverFileName, setCoverFileName] = useState<string | null>(null)

  useEffect(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    setStartsAt(now.toISOString().slice(0, 16))
  }, [])

  const getMinMaxDateTime = () => {
    const now = new Date()
    const min = new Date(now.getTime() + 60 * 60 * 1000) // минимум через 1 час
    min.setMinutes(min.getMinutes() - min.getTimezoneOffset())
    
    const max = new Date()
    max.setFullYear(2050, 11, 31) // 31 декабря 2050
    max.setHours(23, 59)
    max.setMinutes(max.getMinutes() - max.getTimezoneOffset())

    return {
      min: min.toISOString().slice(0, 16),
      max: max.toISOString().slice(0, 16)
    }
  }

  const save = () => {
    if (!title.trim()) {
      alert('Пожалуйста, введите название мероприятия')
      return
    }
    
    if (!startsAt) {
      alert('Пожалуйста, выберите дату и время мероприятия')
      return
    }

    const eventDate = new Date(startsAt)
    const now = new Date()
    if (eventDate <= now) {
      alert('Дата и время мероприятия должны быть в будущем (минимум через 1 час)')
      return
    }

    const maxDate = new Date()
    maxDate.setFullYear(2100, 11, 31)
    if (eventDate > maxDate) {
      alert('Дата мероприятия не может быть позже 31 декабря 2100 года')
      return
    }

    onSave?.({ title: title.trim(), startsAt, coverFileName, category })
  }

  const onCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoverFileName(e.target.files?.[0]?.name ?? null)
  }

  const { min, max } = getMinMaxDateTime()

  return (
    <div className="card formCard">
      <label className="field">
        <span className="label">Обложка мероприятия</span>
        <input className="input" type="file" accept="image/*" onChange={onCoverChange} />
        {coverFileName && <div className="hint">Выбрано: {coverFileName}</div>}
      </label>

      <label className="field">
        <span className="label">Название мероприятия *</span>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="input" 
          placeholder="Например: прогулка, кофе..." 
          maxLength={100}
        />
        <div className="hint">Максимум 100 символов</div>
      </label>

      <label className="field">
        <span className="label">Категория мероприятия *</span>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value as EventCategory)} 
          className="input"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="label">Дата и время мероприятия *</span>
        <input 
          value={startsAt} 
          onChange={(e) => setStartsAt(e.target.value)} 
          className="input" 
          type="datetime-local"
          min={min}
          max={max}
        />
        <div className="hint">
          Мероприятие должно быть запланировано минимум на 1 час вперед и не позднее 31 декабря 2050 года
        </div>
      </label>

      <button type="button" className="button button--full" onClick={save}>
        Создать мероприятие
      </button>
    </div>
  )
}

export default CreateEventForm
