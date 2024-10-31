import axiosInstance from "./axiosInstance"

const deleteExerciseApi = async (exerciseId: number) => {
    const accessToken = localStorage.getItem('authToken')

    const response = await axiosInstance.delete(`/api/exercise/${exerciseId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
    return response.data
}

export default deleteExerciseApi