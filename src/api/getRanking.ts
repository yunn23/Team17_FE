import axiosInstance from './axiosInstance'

interface GetRankingParams {
  groupId: string
  page: number
  size: number
  sort: string
  date: string
}

interface Ranker {
  name: string
  totalExerciseTime: string
}

interface RankingResponse {
  myRanking: number
  myNickname: string
  myTime: string
  page: {
    totalPages: number
    totalElements: number
    size: number
    content: Ranker[]
    number: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    first: boolean
    last: boolean
    numberOfElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
      }
      offset: number
      unpaged: boolean
      paged: boolean
    }
    empty: boolean
  }
}

const getRanking = async ({
  groupId,
  page,
  size,
  sort,
  date
}: GetRankingParams): Promise<RankingResponse> => {
  const accessToken = localStorage.getItem('authToken')

  const response = await axiosInstance.get(`/api/team/${groupId}/ranking`, {
    params: { page, size, sort, date },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
  return response.data
}

export default getRanking
