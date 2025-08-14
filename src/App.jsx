import { Routes, Route, Navigate } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm
        //  trong history của Browser
        // Thực hành để hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình
        //  duyệt giữa 2 trường hợp có replace hoặc không có.
        <Navigate to="/boards/687f3ebfe86870680066c2f8" replace={true} />
      } />

      {/* Board Details */}

      <Route path='/boards/:boardId' element={<Board />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
