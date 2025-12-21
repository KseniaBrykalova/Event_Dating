import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Modal from '../UI/Modal'

type Mode = 'login' | 'register'

type Props = {
  onClose: () => void
  onDone: () => void
}

function AuthModal({ onClose, onDone }: Props) {
  const [mode, setMode] = useState<Mode>('login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, register } = useAuth()

  const submit = async () => {
    if (mode === 'login') {
      await login(email, password)
    } else {
      await register(name, email, password)
    }
    onDone()
  }

  return (
    <Modal onClose={onClose}>
      <div className="modalHeader">
        <div className="modalTitle">{mode === 'login' ? 'Вход' : 'Регистрация'}</div>
        <div className="modalSubtitle">{mode === 'login' ? 'Добро пожаловать обратно' : 'Создай аккаунт за минуту'}</div>
      </div>

      <div className="modalBody">
        {mode === 'register' && (
          <label className="field">
            <span className="label">Имя</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Ваше имя" />
          </label>
        )}

        <label className="field">
          <span className="label">Почта</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="name@mail.ru" />
        </label>

        <label className="field">
          <span className="label">Пароль</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            type="password"
            placeholder="••••••••"
          />
        </label>

        <button type="button" className="button button--full" onClick={submit}>
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <button
          type="button"
          className="linkButton"
          onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login' ? 'Зарегистрироваться' : (
            <>
              Уже есть аккаунт?{' '}
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                Войти
              </span>
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default AuthModal
