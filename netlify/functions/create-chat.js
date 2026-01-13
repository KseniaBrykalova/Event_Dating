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
    const { user1Id, user2Id, eventId } = body
    
    if (!user1Id || !user2Id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Не указаны обязательные поля: user1Id, user2Id' 
        })
      }
    }

    // Проверяем, что пользователи существуют
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .in('id', [user1Id, user2Id])

    if (usersError || users.length !== 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Один или оба пользователя не найдены' })
      }
    }

    // Проверяем мэтч (взаимные лайки)
    const { data: swipes } = await supabase
      .from('swipes')
      .select('*')
      .or(`and(swiper_id.eq.${user1Id},target_id.eq.${user2Id},direction.eq.right),and(swiper_id.eq.${user2Id},target_id.eq.${user1Id},direction.eq.right)`)

    const hasMutualLike = swipes && swipes.length === 2
    
    if (!hasMutualLike) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Нет взаимного мэтча для создания чата' })
      }
    }

    // Определяем порядок user1 < user2 для уникальности
    const [user1IdSorted, user2IdSorted] = 
      user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id]

    // Создаем или получаем существующий чат
    const { data: existingChat } = await supabase
      .from('chats')
      .select('*')
      .eq('user1_id', user1IdSorted)
      .eq('user2_id', user2IdSorted)
      .eq('event_id', eventId || null)
      .single()

    if (existingChat) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          chat: existingChat,
          existed: true,
          message: 'Чат уже существует'
        })
      }
    }

    // Создаем новый чат
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert({
        user1_id: user1IdSorted,
        user2_id: user2IdSorted,
        event_id: eventId || null
      })
      .select()
      .single()

    if (chatError) throw chatError

    // Получаем информацию о собеседниках
    const [{ data: user1 }, { data: user2 }, { data: eventInfo }] = await Promise.all([
      supabase
        .from('users')
        .select('id, name, avatar_url')
        .eq('id', user1Id)
        .single(),
      supabase
        .from('users')
        .select('id, name, avatar_url')
        .eq('id', user2Id)
        .single(),
      eventId ? supabase
        .from('events')
        .select('id, title')
        .eq('id', eventId)
        .single() : Promise.resolve({ data: null })
    ])

    // Форматируем ответ
    const formattedChat = {
      id: chat.id,
      name: eventInfo?.data?.title 
        ? `${user2?.name || 'Собеседник'} (${eventInfo.data.title})`
        : user2?.name || 'Собеседник',
      interlocutor: user2Id === user1IdSorted ? user1 : user2,
      event: eventInfo?.data || null,
      created_at: chat.created_at
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        chat: formattedChat,
        existed: false,
        message: 'Чат успешно создан'
      })
    }

  } catch (error) {
    console.error('Ошибка при создании чата:', error)
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