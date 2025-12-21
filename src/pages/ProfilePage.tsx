import { useNavigate } from 'react-router-dom'
import PasswordChangeCard from '../components/Profile/PasswordChangeCard'
import ProfileInfoCard from '../components/Profile/ProfileInfoCard'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { logout, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    await logout()
    navigate('/')
  }

  const onDelete = async () => {
    await deleteAccount()
    navigate('/')
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <h1 className="h1">Профиль</h1>
      </div>

      <div className="profileGrid">
        <ProfileInfoCard onLogout={onLogout} onDelete={onDelete} />
        <PasswordChangeCard />
      </div>
    </div>
  )
}

export default ProfilePage
