import axiosInstance from "./axiosInstance"

const postExercise = async (exerciseName: string) => {
    const accessToken = localStorage.getItem('authToken')
  
    const response = await axiosInstance.post('/api/exercise',{
      exerciseName
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    return response.data
  }

export default postExercise