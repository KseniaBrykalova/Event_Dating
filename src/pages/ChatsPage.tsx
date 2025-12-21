import ChatsList, { type ChatItem } from '../components/Chats/ChatsList'

const mockChats: ChatItem[] = []

function ChatsPage() {
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
