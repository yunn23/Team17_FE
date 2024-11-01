import axiosInstance from './axiosInstance'

const postStartExercise = async (exerciseId: number) => {
  const accessToken = localStorage.getItem('authToken')

  const response = await axiosInstance.post(
    `/api/exercise/${exerciseId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return response.data
}

export default postStartExercise
