export type ChatItem = {
  id: string
  name: string
  lastMessage: string
}

type Props = {
  chats: ChatItem[]
}

function ChatsList({ chats }: Props) {
  if (chats.length === 0) {
    return (
      <div className="empty empty--center">
        <div className="empty__title">Тут пока пусто</div>
        <div className="empty__text">Но когда начнёте общаться, что-то обязательно появится.</div>
      </div>
    )
  }

  return (
    <div className="list">
      {chats.map((c) => (
        <div key={c.id} className="chatRow" role="button" tabIndex={0}>
          <div className="avatar" aria-hidden="true" />
          <div className="chatRow__text">
            <div className="chatRow__name">{c.name}</div>
            <div className="chatRow__last">{c.lastMessage}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatsList
