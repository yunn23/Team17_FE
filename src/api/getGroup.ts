import axiosInstance from './axiosInstance'
import { Tag } from './getTags'

export interface Team {
  id: number
  teamName: string
  leaderNickname: string
  teamDescription: string
  maxParticipants: number
  currentParticipants: number
  hasPassword: boolean
  tagList: Tag[]
}

export interface TeamResponse {
  content: Team[]
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

export interface MyGroup {
  teamName: string
  leaderNickname: string
  teamDescription: string
  maxParticipants: number
  currentParticipants: number
  password?: string | null
  tagList: Tag[]
}

export interface MyGroupResponse {
  groupList: MyGroup[]
}

export const getGroup = async (
  page = 0,
  size = 8,
  sort = 'asc',
  searchTerm = '',
  activeFilters: number[] = []
): Promise<TeamResponse> => {
  let queryString = `page=${page}&size=${size}&sort=${sort}`

  if (searchTerm) {
    queryString += `&search=${encodeURIComponent(searchTerm)}`
  }

  if (activeFilters.length > 0) {
    queryString += `&filters=${activeFilters.join(',')}`
  }

  const url = `/api/team?${queryString}`
  const response = await axiosInstance.get<TeamResponse>(url)
  return response.data
}

export const getMyGroup = async (): Promise<MyGroup[]> => {
  const response = await axiosInstance.get<MyGroupResponse>('/api/member/group')

  return response.data.groupList
}

export const verifyGroupPassword = async (
  teamId: number,
  password: string
): Promise<boolean> => {
  const response = await axiosInstance.post(`/api/team/checking/${teamId}`, {
    password,
  })
  return response.status === 200
}

export {}
