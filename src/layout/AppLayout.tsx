import { RefObject, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AuthModal from '../components/Auth/AuthModal'
import TopNav from '../components/Navigation/TopNav'

function AppLayout() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const authButtonRef = useRef<HTMLButtonElement>(null) as RefObject<HTMLButtonElement>

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
    // Снимаем фокус с кнопки открытия модалки при закрытии
    if (authButtonRef.current) {
      authButtonRef.current.blur()
    }
  }

  return (
    <div className="appShell">
      <TopNav onAuthClick={openAuthModal} authButtonRef={authButtonRef} />

      <main className="page">
        <Outlet />
      </main>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={closeAuthModal} 
          onDone={closeAuthModal} 
        />
      )}
    </div>
  )
}

export default AppLayout
