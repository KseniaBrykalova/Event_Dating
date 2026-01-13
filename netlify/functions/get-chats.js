const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Метод не разрешен' })
    }
  }

  try {
    const { userId } = event.queryStringParameters
    
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Не указан userId' })
      }
    }

    // Получаем чаты пользователя
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select(`
        id,
        user1_id,
        user2_id,
        event_id,
        created_at,
        events!inner (
          id,
          title
        )
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (chatsError) throw chatsError

    // Получаем информацию о собеседниках и последних сообщениях
    const formattedChats = await Promise.all(chats.map(async (chat) => {
      // Определяем ID собеседника
      const interlocutorId = chat.user1_id === userId ? chat.user2_id : chat.user1_id
      
      // Получаем информацию о собеседнике
      const { data: interlocutor } = await supabase
        .from('users')
        .select('id, name, avatar_url, age, gender, bio, interests')
        .eq('id', interlocutorId)
        .single()

      if (!interlocutor) {
        return null
      }

      // Получаем последнее сообщение в чате
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Получаем количество непрочитанных сообщений
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('chat_id', chat.id)
        .eq('read', false)
        .neq('sender_id', userId)

      // Формируем название чата
      const chatName = chat.events 
        ? `${interlocutor.name} (${chat.events.title})`
        : interlocutor.name

      return {
        id: chat.id,
        name: chatName,
        interlocutor: {
          id: interlocutor.id,
          name: interlocutor.name,
          avatar_url: interlocutor.avatar_url,
          age: interlocutor.age,
          gender: interlocutor.gender,
          bio: interlocutor.bio,
          interests: interlocutor.interests
        },
        event: {
          id: chat.events.id,
          title: chat.events.title
        },
        last_message: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          sender_id: lastMessage.sender_id,
          sender_name: lastMessage.sender_id === userId ? 'Вы' : interlocutor.name,
          created_at: lastMessage.created_at,
          time: new Date(lastMessage.created_at).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          is_own: lastMessage.sender_id === userId
        } : null,
        unread_count: unreadCount || 0,
        created_at: chat.created_at,
        updated_at: lastMessage?.created_at || chat.created_at
      }
    }))

    // Фильтруем null значения (если собеседник не найден)
    const validChats = formattedChats.filter(chat => chat !== null)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        chats: validChats,
        total: validChats.length
      })
    }

  } catch (error) {
    console.error('Ошибка при получении чатов:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      })
    }
  }
}