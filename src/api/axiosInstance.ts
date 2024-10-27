import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://13.125.102.156:8080',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

export default axiosInstance
