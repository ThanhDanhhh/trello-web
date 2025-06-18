import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

import {
  DndContext,
  //  PointerSensor, 
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { CardTravelRounded } from '@mui/icons-material'


const ACTIVIE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  //https://docs.dndkit.com/api-documentation/sensors#usesensor
  // nếu dùng Pointersensor mặc định thì phải kết hợp với thuộc tính CSS touch-action: none ở những phần tử kéo thả - nhưng mà còn bug 
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click gọi event 
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event 
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  //Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug. 
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [oderedColumns, setOrderedColumns] = useState([])

  // cùng một thời điểm chỉ có một phần tử đang được kéo (column hoạc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)


  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])


  // Trigger khi bắt đàu một hành động kéo (drag)
  const handleDragStart = (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVIE_DRAG_ITEM_TYPE.CARD : ACTIVIE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Trigger khi kết thúc một hành động kéo (drag) một phần tử => hành đọng thả drop
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tại over(kéo linh tinh thì return luôm tránh lỗi) 
    if (!over) return

    // Nếu vị trí kéo thả thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // lấy vị trí cũ (từ thằng active)
      const oldIndex = oderedColumns.findIndex(c => c._id === active.id)
      // lấy vị trí mới (từ thằng active)
      const newIndex = oderedColumns.findIndex(c => c._id === over.id)

      // Dừng arrayMove của thằng dnd-kit để sắp xếp lại mảng colums ban đầu 
      // Code arrayMove ở đây: dnd-kit/packages/sortable/src/arrayMove.ts
      const dndOrderedColumns = arrayMove(oderedColumns, oldIndex, newIndex)
      // 2 cái console.log dữ liệu này sau dùng để xử lý gọi API 
      // const dndOrderedIds = dndOrderedColumns.map(c => c._id)      
      // console.log('dndOrderedIds: ', dndOrderedIds)   
      // console.log('dndOrderedColumns: ', dndOrderedColumns)

      // Cập nhật lại state columns ban đầu sau khi đã kéo thả
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  console.log('activeDragItemData: ', activeDragItemData)
  console.log('activeDragItemType: ', activeDragItemType)
  console.log('activeDragItemId: ', activeDragItemId)

  // Animation khi thả (Drop) phần tử - Test bằng cách kéo xong thả trực tiếp và nhìn phần tử giữ chổ overlay
  const customdropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5', } }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd} >

      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={oderedColumns} />
        <DragOverlay dropAnimation={customdropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVIE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVIE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>

  )
} 0

export default BoardContent
