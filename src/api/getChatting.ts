import axiosInstance from './axiosInstance'

export interface ChatMessage {
  chatId: number
  nickname: string
  message: string
  createdAt: string
}

export const fetchInitialMessages = async (
  roomId: string
): Promise<ChatMessage[]> => {
  const response = await axiosInstance.get<{ content: ChatMessage[] }>(
    `/api/chat/room/${roomId}`
  )
  return response.data.content
}
