import axiosInstance from './axiosInstance'

const putStopExercise = async (exerciseId: number) => {
  const accessToken = localStorage.getItem('authToken')

  const response = await axiosInstance.put(
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

export default putStopExercise
