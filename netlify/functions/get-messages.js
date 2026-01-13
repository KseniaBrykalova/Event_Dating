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
    const { chatId, userId, limit = 50, before } = event.queryStringParameters
    
    if (!chatId || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Не указаны обязательные параметры: chatId, userId' 
        })
      }
    }

    // Проверяем доступ пользователя к чату
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select(`
        id,
        user1_id,
        user2_id,
        event_id,
        events (
          id,
          title
        )
      `)
      .eq('id', chatId)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single()

    if (chatError || !chat) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Доступ к чату запрещен' })
      }
    }

    // Определяем собеседника
    const interlocutorId = chat.user1_id === userId ? chat.user2_id : chat.user1_id
    
    // Получаем информацию о собеседнике
    const { data: interlocutor } = await supabase
      .from('users')
      .select('id, name, avatar_url')
      .eq('id', interlocutorId)
      .single()

    // Формируем запрос для получения сообщений
    let query = supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    // Пагинация (загрузка более старых сообщений)
    if (before) {
      query = query.lt('created_at', before)
    }

    const { data: messages, error: messagesError } = await query

    if (messagesError) throw messagesError

    // Помечаем сообщения как прочитанные
    if (messages.length > 0) {
      const messageIds = messages
        .filter(msg => !msg.read && msg.sender_id !== userId)
        .map(msg => msg.id)

      if (messageIds.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', messageIds)
      }
    }

    // Форматируем сообщения
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender_id: msg.sender_id,
      sender_name: msg.sender_id === userId ? 'Вы' : interlocutor?.name || 'Пользователь',
      sender_avatar: msg.sender_id === userId ? null : interlocutor?.avatar_url,
      is_own: msg.sender_id === userId,
      read: msg.sender_id === userId ? true : msg.read,
      created_at: msg.created_at,
      time: new Date(msg.created_at).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: new Date(msg.created_at).toLocaleDateString('ru-RU')
    })).reverse() // Возвращаем в хронологическом порядке

    // Определяем, есть ли еще сообщения для загрузки
    const hasMore = messages.length === parseInt(limit)
    const oldestMessage = messages.length > 0 ? messages[messages.length - 1].created_at : null

    // Формируем название чата
    const chatName = chat.events 
      ? `${interlocutor?.name || 'Собеседник'} (${chat.events.title})`
      : interlocutor?.name || 'Собеседник'

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        chat: {
          id: chatId,
          name: chatName,
          interlocutor: interlocutor ? {
            id: interlocutor.id,
            name: interlocutor.name,
            avatar_url: interlocutor.avatar_url
          } : null,
          event: chat.events ? {
            id: chat.events.id,
            title: chat.events.title
          } : null
        },
        messages: formattedMessages,
        pagination: {
          limit: parseInt(limit),
          has_more: hasMore,
          oldest_message: oldestMessage,
          total_loaded: formattedMessages.length
        }
      })
    }

  } catch (error) {
    console.error('Ошибка при получении сообщений:', error)
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