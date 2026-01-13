import { useState, useCallback } from 'react'

export function useChats() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchChats = useCallback(async (userId) => {
    if (!userId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/get-chats?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setChats(data.chats)
      return data.chats
    } catch (err) {
      setError(err.message)
      console.error('Ошибка загрузки чатов:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (chatId, senderId, content) => {
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          senderId,
          content
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка отправки сообщения')
      }

      return await response.json()
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err)
      throw err
    }
  }, [])

  const getMessages = useCallback(async (chatId, userId, limit = 50) => {
    try {
      const response = await fetch(
        `/api/get-messages?chatId=${chatId}&userId=${userId}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err)
      throw err
    }
  }, [])

  return {
    chats,
    loading,
    error,
    fetchChats,
    sendMessage,
    getMessages,
    setChats
  }
}