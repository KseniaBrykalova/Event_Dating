const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Метод не разрешен' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { chatId, senderId, content, tempId } = body
    
    if (!chatId || !senderId || !content || content.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Не указаны обязательные поля: chatId, senderId, content' 
        })
      }
    }

    // Проверяем существование чата и доступ
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('user1_id, user2_id, event_id')
      .eq('id', chatId)
      .or(`user1_id.eq.${senderId},user2_id.eq.${senderId}`)
      .single()

    if (chatError || !chat) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Чат не найден или доступ запрещен' })
      }
    }

    // Проверяем, что между пользователями есть мэтч (взаимные свайпы вправо)
    const receiverId = chat.user1_id === senderId ? chat.user2_id : chat.user1_id
    
    const { data: mutualSwipes } = await supabase
      .from('swipes')
      .select('*')
      .or(`and(swiper_id.eq.${senderId},target_id.eq.${receiverId},direction.eq.right),and(swiper_id.eq.${receiverId},target_id.eq.${senderId},direction.eq.right)`)

    const hasMutualLike = mutualSwipes && mutualSwipes.length === 2
    
    if (!hasMutualLike) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Нет взаимного мэтча для общения' })
      }
    }

    // Создаем сообщение
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        content: content.trim(),
        read: false
      })
      .select()
      .single()

    if (messageError) throw messageError

    // Получаем информацию об отправителе и чате
    const [{ data: sender }, { data: receiver }, { data: chatInfo }] = await Promise.all([
      supabase
        .from('users')
        .select('id, name, avatar_url')
        .eq('id', senderId)
        .single(),
      supabase
        .from('users')
        .select('id, name, avatar_url')
        .eq('id', receiverId)
        .single(),
      supabase
        .from('chats')
        .select('events(title)')
        .eq('id', chatId)
        .single()
    ])

    // Форматируем ответ
    const responseMessage = {
      id: message.id,
      temp_id: tempId, // Для синхронизации с фронтендом
      chat_id: message.chat_id,
      sender_id: message.sender_id,
      sender_name: sender?.name || 'Вы',
      sender_avatar: sender?.avatar_url,
      content: message.content,
      read: message.read,
      created_at: message.created_at,
      time: new Date(message.created_at).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      date: new Date(message.created_at).toLocaleDateString('ru-RU')
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: responseMessage,
        receiver: {
          id: receiverId,
          name: receiver?.name || 'Собеседник',
          avatar_url: receiver?.avatar_url
        },
        event_title: chatInfo?.events?.title || null
      })
    }

  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error)
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