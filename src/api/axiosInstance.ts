import axios from 'axios'
import { useNavigate } from 'react-router'

const axiosInstance = axios.create({
  baseURL: 'https://home-try.13.125.102.156.sslip.io',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

export const setupAxiosInterceptor = (
  navigate: ReturnType<typeof useNavigate>
) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        navigate('/login')
      }
      if (error.response?.data?.errorCode === 'Member400_001') {
        navigate('/login')
      }
      if (error.response?.data?.errorCode === 'Auth400_001') {
        navigate('/login')
      }
      return Promise.reject(error)
    }
  )
}

export default axiosInstance
