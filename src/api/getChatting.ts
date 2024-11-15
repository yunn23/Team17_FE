import axiosInstance from './axiosInstance'

export interface ChatMessage {
  chatId: number
  memberId: number
  nickName: string
  chattedAt: Date
  message: string
}

export interface ChatResponse {
  content: ChatMessage[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  first: boolean
  last: boolean
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  empty: boolean
}

export const fetchInitialMessages = async (
  groupId: string,
  page: number = 0,
  size: number = 20
): Promise<ChatResponse> => {
  const response = await axiosInstance.get<ChatResponse>(
    `/api/team/chatting/${groupId}?page=${page}&size=${size}`
  )
  return response.data
}
