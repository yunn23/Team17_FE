import axiosInstance from './axiosInstance'

interface MypageResponse {
  nickname: string
  email: string
  attendance: number
  weeklyTotal: string
  monthlyTotal: string
}

const getMypage = async (): Promise<MypageResponse> => {
  const accessToken = localStorage.getItem('authToken')

  const response = await axiosInstance.get('/api/member/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export default getMypage
