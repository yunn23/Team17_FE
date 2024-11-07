import axiosInstance from './axiosInstance'

const getMain = async (formattedDate: string) => {
  const response = await axiosInstance.get('/api', {
    params: {
      date: formattedDate,
    },
  })
  return response.data
}

export default getMain
