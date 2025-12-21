import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

type Props = {
  onSaved?: () => void
}

function PasswordChangeCard({ onSaved }: Props) {
  const { updatePassword } = useAuth()

  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')

  const onSavePassword = async () => {
    await updatePassword(oldPass, newPass)
    setOldPass('')
    setNewPass('')
    onSaved?.()
  }

  return (
    <div className="card">
      <div className="cardTitle">Смена пароля</div>

      <label className="field">
        <span className="label">Нынешний пароль</span>
        <input value={oldPass} onChange={(e) => setOldPass(e.target.value)} className="input" type="password" />
      </label>

      <label className="field">
        <span className="label">Новый пароль</span>
        <input value={newPass} onChange={(e) => setNewPass(e.target.value)} className="input" type="password" />
      </label>

      <div className="buttonRow">
        <button type="button" className="button button--ghost">
          Не помню пароль
        </button>
        <button type="button" className="button" onClick={onSavePassword}>
          Сохранить
        </button>
      </div>
    </div>
  )
}

export default PasswordChangeCard
