import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumTitle] = useState('')

  const AddNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title!')
      return
    }

    // Tạo dữ liệu column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }

    //Gọi API tạo mới column và làm lại dữ liệu State Board
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

    /** cách 1:
     * Đoạn này sẽ dính lỗi object is not extensible bởi dù đã coppy/clone ra giá trị newBoard nhưng bản chất
     * của spread opentor là Shallow Coppy/Clone, nếu dính phải rules Immutability trong Redux Toolkit không
     * ta là dùng tiws Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn.
     * https://redux-toolkit.js.org/usage/immer-reducers
     * Tài liệu thêm về Shollow và Deep Copy Object trong JS:
     * https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
     */
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    /** cách 2:
     * Ngoài ra cách nữa là vẫn có thể dùng array.concat thay cho push như docs của Redux Toolkit ở trên vì
     * push như đã nói nó sẽ thay đổi giá trị mảng trực tiếp, còn thằng concat thì nó merge - ghep mảng lại và
     * tạo ra một mảng mới để chúng ta gán lại giá trị nên không vấn đề gì.
     */
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])

    // Cập nhật dữ liệu Board vào trong Redux Store
    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng trạng thái thêm Column mới & Clear Input
    toggleOpenNewColumnForm()
    setNewColumTitle('')
  }

  /**
  * Thằng SortableConent yêu cầu items là một mảng dạng ['id-1', 'id-2', 'id-3'] chứ không phải [{id: 'id-1',
   id: 'id-2', id: 'id-3'}]
  * Nếu không đúng vẫn kẻo thả được nhưng không animation
  * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  * **/

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column =>
          <Column key={column._id} column={column} />)}

        {/* Box Add new column CTA */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
              startIcon={<NoteAddIcon />}
            >Add new column</Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }

                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={AddNewColumn}
                variant="contained" color="success" size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }

      </Box>
    </SortableContext>
  )
}

export default ListColumns
