import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Lưu ý: Đối với việc sử dụng axios ở khóa MERN Stack Pro
 * Tất cả các function bên dưới các bạn sẽ thấy mình chỉ request và lấy data luôn, mà không có try catch hay then catch gì để bắt lỗi
 * Lý do là vì ở phí font-end chúng ta ckhoong cần thiết làm như vậy đối với mọi request bởi nó sẽ gây ra việc dư thừa code catch looix quá nhiều.
 * Giải pháp clean code gọn gàng đó là chúng ta sẽ catch lỗi tập trung tại một nơi bằng cách tận dụng một thứ cực kì mạnh mẽ trong axios dó là Interceptors
 * Hiểu đơn giản Interceptors là cách mà chúng ta sẽ đánh chặn vào giữ request hoặc responce để xử lý logic mà chúng ta muốn
 * (và học phần MERN Stacj Advance nâng cao sẽ dạy cực kỳ đầy đủ cách xử lý, áp dụng phần này chuẩn chỉnh cho các bạn.)
*/

/** Boards */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios sẽ trả về kết quả vè qua property của nó là data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

/** Columns */
export const createNewColumnAPI = async (newColumnData) => {
  const responce = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return responce.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

/** Cards */
export const createNewCardAPI = async (newCardData) => {
  const responce = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return responce.data
}