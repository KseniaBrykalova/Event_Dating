import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatsList, { type ChatItem } from '../components/Chats/ChatsList'
import { useAuth } from '../context/AuthContext'

const mockChats: ChatItem[] = []

function ChatsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
  }, [user, navigate])

  if (!user) {
    return null // Будет редирект на главную через useEffect
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <h1 className="h1">Чаты</h1>
      </div>

      <ChatsList chats={mockChats} />
    </div>
  )
}

export default ChatsPage
