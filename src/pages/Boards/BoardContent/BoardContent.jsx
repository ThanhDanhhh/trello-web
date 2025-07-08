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
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { CardTravelRounded } from '@mui/icons-material'
import { circularProgressClasses } from '@mui/material'
import { cloneDeep } from 'lodash'


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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)


  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm một cái column theo cardId 
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.carOrderIds bởi vì ở bước handledragOver 
    //chúng ta sẽ làm dưc liệu cho cards hoàn chỉnh trước rồi mới tạo ra CardsOrderIds mới.
    return oderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Trigger khi bắt đàu một hành động kéo (drag)
  const handleDragStart = (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVIE_DRAG_ITEM_TYPE.CARD : ACTIVIE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //Nếu kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  //Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // Không làm gì thêm nếu đang kéo column 
    if (activeDragItemType === ACTIVIE_DRAG_ITEM_TYPE.COLUMN) return

    // Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    // console.log('handleDragOver', event)
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoạc over(khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return

    // acctiveDraggingCard: là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard:là cái Cảd đang tương tác trên hoạc dứoi só với cái card được kéo ở trên 
    const { id: overCardId } = over

    // Tìm 2 cái column theo cardId 
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thù nó là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(preveColumns => {
        // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // Logic tinhs toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện - nhiều khi muốn từ chối hiểu =))
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng OderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OderedColumns mới
        const nextColumns = cloneDeep(preveColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        // column cũ
        if (nextActiveColumn) {
          // Xoá card ở cái column active (cũng có thể hiểu là column cũ, caí lúc mà kéo card ra khỏi nó đẻ sang column khác)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        // column mới
        if (nextOverColumn) {
          // Kiểm tra xem card đáng kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xoá nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Tiếp theo là thêm cái card đang kéo overColumn vào vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }

    // // Nếu kéo card vào column khác thì thực hiện kéo card qua lại giữa các columns
    // if (activeColumn?._id !== overColumn?._id) {
    //   // console.log('Hành động kéo thả card - Tạm thời không làm gì cả')
    //   return
    // }

  }

  // Trigger khi kết thúc một hành động kéo (drag) một phần tử => hành động thả drop
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over ( khi kéo ra khỏi phạm vi vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return

    //Xử lý kéo thả Card
    if (activeDragItemType === ACTIVIE_DRAG_ITEM_TYPE.CARD) {

      // acctiveDraggingCard: là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard:là cái Cảd đang tương tác trên hoạc dứoi só với cái card được kéo ở trên 
      const { id: overCardId } = over

      // Tìm 2 cái column theo cardId 
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2column khác nhau
      // Phải dùng tới activeDragItemData.columnId hoặc oldWhenDraggingCard._id  này vì (set từ bước handleDragStart) chứ không phải activeData trong scope handledragEnd 
      // này vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật một lần rồi.
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //
      } else {
        // Hành động ekso tảh Card trong cùng 1 cái column

        // lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard) 
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lấy vị trí mới (từ thằng active)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // Dùng arayMove vì kéo card trong 1 cái column thì tượng tự với logic kéo column trong một cái board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(preveColumns => {
          // Clone mảng OderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OderedColumns mới
          const nextColumns = cloneDeep(preveColumns)

          // Tìm tới column mà chúng ta đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và carOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          // Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }

    }

    //Xử lý kéo thả columns trong 1 cái boardContent
    if (activeDragItemType === ACTIVIE_DRAG_ITEM_TYPE.COLUMN) {
      console.log('hành động kéo thả Column - Tạm thời không làm gì cả!')

      // Nếu vị trí kéo thả thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // lấy vị trí cũ (từ thằng active) 
        const oldColumnIndex = oderedColumns.findIndex(c => c._id === active.id)
        // lấy vị trí mới (từ thằng active)
        const newColumnIndex = oderedColumns.findIndex(c => c._id === over.id)

        // Dừng arrayMove của thằng dnd-kit để sắp xếp lại mảng colums ban đầu 
        // Code arrayMove ở đây: dnd-kit/packages/sortable/src/arrayMove.ts
        const dndOrderedColumns = arrayMove(oderedColumns, oldColumnIndex, newColumnIndex)
        // 2 cái console.log dữ liệu này sau dùng để xử lý gọi API 
        // const dndOrderedIds = dndOrderedColumns.map(c => c._id)      
        // console.log('dndOrderedIds: ', dndOrderedIds)   
        // console.log('dndOrderedColumns: ', dndOrderedColumns)

        // Cập nhật lại state columns ban đầu sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // NHững dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // console.log('activeDragItemData: ', activeDragItemData)
  // console.log('activeDragItemType: ', activeDragItemType)
  // console.log('activeDragItemId: ', activeDragItemId)

  // Animation khi thả (Drop) phần tử - Test bằng cách kéo xong thả trực tiếp và nhìn phần tử giữ chổ overlay
  const customdropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5', } }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
