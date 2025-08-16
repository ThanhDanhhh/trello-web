import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo đối tượng axios (authoriedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authoriedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 reqquest: để 10 phút
authoriedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép axios tựddoongj gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta
//  sẽ lưu JWT tokens (refresh & acces) vào trong httpOnly Cookie của trình duyệt)
authoriedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (bộ đánh chặn vào giữa mọi Request & Response)
 * https://axios-http.com/docs/interceptors
 */
// interceptor request: Can thiệ vào giữa những cái request API
authoriedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formaters chứa function)
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// interceptor Response: Can thiệp vào giữa những cái response nhận về
authoriedAxiosInstance.interceptors.response.use((response) => {
  // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formaters chứa function)
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  /* Mọi mã http status nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây */

  // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formaters chứa function)
  interceptorLoadingElements(false)

  // Xử lý tập trung phần hiển thị không báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
  // console.log error ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây
  console.log('🚀 ~ error:', error)
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình = Ngoại trừ mã 410 - GONE phục vụ việc từ
  // động refresh lại token.
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authoriedAxiosInstance