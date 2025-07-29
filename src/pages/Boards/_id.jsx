/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

// import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'


function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao là chúng ta sẽ sử dụng react-router-dm để lấy chuẩn boardId tuwd URL về
    const boardId = '687f3ebfe86870680066c2f8'
    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {

      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần fix bug quan trọng)
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        //khi f5 trang web thi cần xử lý vấn đề kéo thả vào một column rỗng( nhớ xem lại video 37.2, code hiện tại là video 69)
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (video 71 đã giải thích lý do ở phần fix bug quan trọng)
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
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

  /**
   * function này có nhiệm vụ gọi API với xử lý khi kéo thả column xong xuôi
   * Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó ( thay đổi vị trí trong board)
   */
  const moveColumns = (dndOrderedColumns) => {
    // Update cập nhật cho chuẩn dữ liệu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API Update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  /**
   * Khi di chuyển card trong cùng column:
   * Chỉ cần gọi API để cập nhật mảng CardOrderIds của column chứa nó ( thay đổi vị trí trong mảng)
   */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Update cho chuẩn dữ liệu của state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)

    //Gọi API update board
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  /**
   * Khi di chuyển card sang Column khác:
   * B1: Cập nhật cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
   * B2: Cập nhật mảng CardOrderIds của Column tiếp theo (Hiểu bản chất của thên _id của Card vào mảng)
   * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
   * => Làm một API support riêng.
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    // Update cập nhật cho chuẩn dữ liệu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý ở phía BE
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
