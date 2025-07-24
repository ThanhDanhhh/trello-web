/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao là chúng ta sẽ sử dụng react-router-dm để lấy chuẩn boardId tuwd URL về
    const boardId = '687f3ebfe86870680066c2f8'
    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {
      //khi f5 trang web thi cần xử lý vấn đề kéo thả vào một column rỗng( nhớ xem lại video 37.2, code hiện tại là video 69)
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })

      setBoard(board)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // function này có nhiệm vụ gọi API và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Khi tạo column mới thì nó sẽ chưa có card, cần xử lý vấn đề kéo thả vào một column rỗng( Nhớ lại
    // video 37.2,code hiện tại video 69)
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật state board
    /**
     * Phía Font-end chúng ta làm đúng lại state data board( thay vì gọi lại api fetchBoardDetailsAPI)
     * Lưu ý: Cách làm này phụ thuộc vào tùy chọn đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn toàn bộ Board
     * dù đây là api tạo column hay Card đi chăng nữa. => Lúc này FE nhàn hơn.
     */
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // function này có nhiệm vụ gọi API và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật state board
    /**
     * Phía Font-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api
     * fetchBoardDetailsAPI)
     * Lưu ý; Cách làm này phụ thuộc vào tùy lựa chọn và đặc thì dự án, có nơi thì BE hỗ trợ trả về luôn
     * toàn bộ Board dù đây có là api tạo column hay Card đi chăng nữa. => Lúc này FE sẽ nhàn hơn.
     */
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
