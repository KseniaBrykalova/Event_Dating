import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/Auth/AuthModal'

function AuthPage() {
  const navigate = useNavigate()

  return (
    <div className="authPage">
      <AuthModal onClose={() => navigate('/')} onDone={() => navigate('/')} />
    </div>
  )
}

export default AuthPage
