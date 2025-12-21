import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

type Props = {
  onLogout: () => void
  onDelete: () => void
}

function ProfileInfoCard({ onLogout, onDelete }: Props) {
  const { user } = useAuth()
  const [avatarName, setAvatarName] = useState<string | null>(null)

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAvatarName(e.target.files?.[0]?.name ?? null)
  }

  return (
    <div className="card">
      <div className="profileHeader">
        <label className="avatarUpload" aria-label="Загрузить аватар">
          <input type="file" accept="image/*" onChange={onAvatarChange} />
          <div className={avatarName ? 'avatar avatar--filled' : 'avatar avatar--empty'}>{avatarName ? '✓' : '+'}</div>
        </label>

        <div>
          <div className="profileName">{user?.name ?? 'Гость'}</div>
          <div className="profileEmail">{user?.email ?? '—'}</div>
        </div>
      </div>

      <div className="buttonRow">
        <button type="button" className="button button--secondary">
          Пройти анкету
        </button>
        <button type="button" className="button button--secondary">
          Ваши мероприятия
        </button>
      </div>

      <div className="dangerRow">
        <button type="button" className="button button--ghost" onClick={onLogout}>
          Выйти
        </button>
        <button type="button" className="button button--danger" onClick={onDelete}>
          Удалить аккаунт
        </button>
      </div>
    </div>
  )
}

export default ProfileInfoCard
