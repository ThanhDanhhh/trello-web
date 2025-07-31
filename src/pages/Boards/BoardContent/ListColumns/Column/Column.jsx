import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Cloud from '@mui/icons-material/Cloud'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'


function Column({ column, createNewCard, deleteColumnDetails }) {

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    // touchAction: 'none', // Dành cho sensors default dạn PointerSensor
    //Nấu sử dụng CSS.transform hư docs sẽ lỗi stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    //  Chiều cao phải luôn max 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua một cái colum daì thì ohair kéo
    // ở khu vực giữa giữa rất khó chịu(demo ở video 32). Lưu ý lúc này phải kết hợp với {...listerners} nằm ở Box
    // chứ không phải ở div ngaoif cùng để tránh trường hợp kéo vào vùng xanh.
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // Cards đã được sắp xếp ở component cha cao nhất (boards/_id.jsx) (Video 71 đã giải thích lý do)
  const oderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const AddNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title!', { position: 'bottom-right' })
      return
    }
    // Tạo dữ liệu column để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    /**
    * Gọi lên props function createNewColumn nằm ở component cha ca nhất (boards/_id.jsx)
    * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao thì chúng ta sẽ đưa dữ liệu Board ra ngoài Redux Global Store,
    * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì lần lượt gọi ngược lên những
    * component cha phía trên. (Đối với component con nằm càng sâu thì cảng khổ :D)
    * - Với việc sử dụng Redux như vậy thì code sẽ clean chuẩn chỉnh hơn rất nhiều.
    */
    createNewCard(newCardData)

    // Đóng trạng thái thêm Card mới & clear Input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }
  // Xử lý xóa một column và card bên trong nó
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'This action will permanently delete your Column and its Cards! Are you sure?',
      confirmationText: 'Cofirm',
      cancellationText: 'Cancel'
      // buttonOrder: ['confirm', 'cancel']
      // content: 'Test content he he'
      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
      // cancellationButtonProps: { color: 'inherit' },
      // description: 'Phại nhật chữ TylerDangDev mới được confirm',
      // confirmationKeyword: 'TylerDangDev'
    }).then(() => {
      /**
       * Gọi lên próp function deleteColumnDetails nằm ở component cha cao nhất (boards/_id.jsx)
       * Lưu ý: Về sau ở học phần nâng cao chúng ta sẽ đưa dữ liệu Board ra ngoài Redux Global Store,
       * Và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những
       * component cha phía bên trên. (Đối với component con nằm càng sâu thì cảng khổ :D)
       * - Với việc sử dụng Redux như vậy thì code sẽ clean chuẩn chỉnh hơn rất nhiều.
       */
      deleteColumnDetails(column._id)
    }).catch(() => { })
  }

  // phải bọc div ở đây vì vấn đề chiều cao vì vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu flickering
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles}{...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        {/* Box Column Header */}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,

          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {column?.title}

          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': { color: 'success.light' }
                  }
                }}>
                <ListItemIcon><AddCardIcon className='add-card-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Coppy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' }
                  }
                }}>
                <ListItemIcon><DeleteForeverIcon className='delete-forever-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* list Card */}
        <ListCards cards={oderedCards} />

        {/* Box Column Footer */}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add New Card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant='outlined'
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }

                  },
                  '& .MuioutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={AddNewCard}
                  variant="contained" color="success" size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }


        </Box>
      </Box>
    </div>
  )
}

export default Column
