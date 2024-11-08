import axiosInstance from './axiosInstance'
import { Team } from './getGroup'

interface Tag {
  tagId: number
}

interface GroupData {
  teamName: string
  teamDescription: string
  maxParticipants: number
  password: string | null | undefined
  tagIdList: Tag[]
}

const postGroup = async ({
  teamName,
  teamDescription,
  maxParticipants,
  password,
  tagIdList,
}: GroupData) => {
  const response = await axiosInstance.post('/api/team', {
    teamName,
    teamDescription,
    maxParticipants,
    password,
    tagIdList: tagIdList.map((tag) => ({ tagId: tag.tagId })),
  })
  return response.data
}

export const joinGroup = async (group: Team) => {
  const response = await axiosInstance.post(`/api/team/join/${group.id}`)
  return response.data
}

export default postGroup
