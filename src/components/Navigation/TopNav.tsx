import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type Props = {
  onAuthClick: () => void
  authButtonRef?: React.RefObject<HTMLButtonElement>
}

function TopNav({ onAuthClick, authButtonRef }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigateTo = (path: string) => () => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="topNav">
      <div className="topNav__inner">
        <button className="brand" onClick={navigateTo('/')}>
          Event Dating
        </button>

        {/* Десктопная навигация */}
        <nav className="navLinks navLinks--desktop" aria-label="Основная навигация">
          <button className="navLink" onClick={navigateTo('/')}>
            Мероприятия
          </button>
          <button className="navLink" onClick={navigateTo('/chats')}>
            Чаты
          </button>
          <button className="navLink" onClick={navigateTo('/create')}>
            Создать
          </button>
          {user ? (
            <button className="navLink" onClick={navigateTo('/profile')}>
              Профиль
            </button>
          ) : (
            <button 
              ref={authButtonRef}
              className="navLink" 
              onClick={onAuthClick}
            >
              Вход
            </button>
          )}
        </nav>

        {/* Мобильное меню */}
        <button 
          className={`mobileMenuToggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Открыть меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Мобильная навигация */}
        <div className={`mobileMenuOverlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu} />
        <nav className={`navLinks navLinks--mobile ${isMobileMenuOpen ? 'active' : ''}`} aria-label="Мобильная навигация">
          <button className="navLink" onClick={navigateTo('/')}>
            Мероприятия
          </button>
          <button className="navLink" onClick={navigateTo('/chats')}>
            Чаты
          </button>
          <button className="navLink" onClick={navigateTo('/create')}>
            Создать
          </button>
          {user ? (
            <button className="navLink" onClick={navigateTo('/profile')}>
              Профиль
            </button>
          ) : (
            <button className="navLink" onClick={() => {
              onAuthClick()
              setIsMobileMenuOpen(false)
            }}>
              Вход
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default TopNav
