import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { generatPlaceholderCard } from '~/utils/formatters'


import { DndContext,
  //PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
  //rectIntersection,
    //closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState, useEffect, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent(props) {

  //yeu cau chuot di chuyen 10px moi bat event drag (neu khong se dinh loi click chay event)
  //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  //yeu cau chuot di chuyen 10px moi bat event drag (neu khong se dinh loi click chay event)
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // nhan giu 250ms va dung sai cua cam ung 500 thi moi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  //const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)


  const { board } = props
  const [orderedColums, setOrderedColumns] = useState([])

  //cung 1 thoi diem chi co 1 phan tu duoc keo (column or card)
  const [activeDagItemId, setActiveDagItemId] = useState([null])
  const [activeDagItemType, setActiveDagItemType] = useState([null])
  const [activeDagItemData, setActiveDagItemData] = useState([null])
  //state luu lại column ban đầu khi bắt đầu kéo để không bị update state khi overDarg
  const [oldColumDagingCard, setOldColumDagingCard] = useState([null])

  //diem va cham cuoi cung truoc do de xu ly thuat toan phat hien va cham
  const lastOverId = useRef(null)

  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColmnByCardId = (cardId) => {
    // kiem tra xem card dang nam trong column nao
    return orderedColums.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  const moveCardBetweenDifferentColumn = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDargingCardId,
    activeDargingCardData
  ) => {
    setOrderedColumns( prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      // logic lấy ra "cardIndex mới" (trên hoặc dưới overCard)
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
              active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //clone mảng OrderedColumnState cũ ra một cái mới để xử lý data rồi cập nhật lại
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
      //colums moi
      if (nextActiveColumn) {
        // xoa card tu column active (la card bi keo di ra khoi column cu sang column moi)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDargingCardId)

        //them Placeeholder Card neu column bi rong( card cuoi cung bi keo di)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatPlaceholderCard(nextActiveColumn)]
        }

        // cap nhat lai mang cardOrderIds cho chuan du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      // column cu
      if (nextOverColumn) {
        //kiem tra xem card dang keo no co ton tai trong overColum chua, neu co thi xoa truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDargingCardId)

        //đối với dragEnd thì phải cập nhập lại chuẩn dữ liệu columnId trong card sau khi kéo card sang column mới
        const rebiuld_activeDargingCardData = {
          ...activeDargingCardData,
          columnId: nextOverColumn._id
        }
        //them card dang keo vao overColumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebiuld_activeDargingCardData)

        //Xoa placeholder Card di neu no dang ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.PE_PlaceholderCard)

        // cap nhat lai mang cardOrderIds cho chuan du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }
  //khi bat dau keo 1 phan tu
  const handleDragStart = (event) => {
    //console.log('handleDragStart', event)
    setActiveDagItemId(event?.active?.id)
    setActiveDagItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDagItemData(event?.active?.data?.current)

    //state luu lại column ban đầu khi bắt đầu kéo để không bị update state khi overDarg
    if (event?.active?.data?.current?.columnId) {
      setOldColumDagingCard(findColmnByCardId(event?.active?.id))
    }
  }

  //trong qua trinh keo tha 1 phan tu
  const handleDragOver = (event) => {
    // khong lam gi khi dang keo column
    if (activeDagItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    //console.log('handleDragOver: ', event)
    // xu ly khi keo tha card
    const { active, over } = event

    //kiem tra neu khong co over(keo ra ngoai) thi return de tranh loi
    if (!active || !over) { return }

    //activeDargingCardId la card dang duoc keo
    const { id: activeDargingCardId, data: { current: activeDargingCardData } } = active
    //overCardId la card dang duoc tuong tac toi
    const { id: overCardId } = over

    const activeColumn = findColmnByCardId(activeDargingCardId)
    const overColumn = findColmnByCardId(overCardId)

    //neu khong ton tai 1 trong 2 column thi khong lam gi
    if (!activeColumn || !overColumn) return
    // neu keo sang column khac thi se xu ly
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumn(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDargingCardId,
        activeDargingCardData
      )
    }
  }

  // khi ket thuc hanh dong keo (tha) mot phan tu
  const handelDragEnd = (event) => {
    //console.log('handelDragend', event)
    const { active, over } = event
    //kiem tra neu khong co over(keo ra ngoai) thi return de tranh loi
    if (!active || !over) { return }

    //xử lý kéo thả card
    if (activeDagItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDargingCardId la card dang duoc keo
      const { id: activeDargingCardId, data: { current: activeDargingCardData } } = active
      //overCardId la card dang duoc tuong tac toi
      const { id: overCardId } = over

      const activeColumn = findColmnByCardId(activeDargingCardId)
      const overColumn = findColmnByCardId(overCardId)

      //neu khong ton tai 1 trong 2 column thi khong lam gi
      if (!activeColumn || !overColumn) return

      //kiểm tra column_id có thay đổi không để biết đang kéo thả trong cùng column hay sang column khác
      if (oldColumDagingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumn(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDargingCardId,
          activeDargingCardData
        )

      } else {
        // kéo thả card trong cùng column
        //lay vi tri cu cua active
        const oldCardIndex = oldColumDagingCard?.cards?.findIndex(c => c._id === activeDagItemId)
        //lay vi tri moi từ over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        const dndOrderedCards = arrayMove(oldColumDagingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns( prevColumns => {

          //clone mảng OrderedColumnState cũ ra một cái mới để xử lý data rồi cập nhật lại
          const nextColumns = cloneDeep(prevColumns)

          //tim toi column dang tha
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // cập nhật lại 2 giá trị mới và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumns
        })

      }
    }

    //xử lý kéo thả column
    if (activeDagItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        //lay vi tri cu cua active
        const oldColumnIndex = orderedColums.findIndex(c => c._id === active.id)
        //lay vi tri moi
        const newColumnIndex = orderedColums.findIndex(c => c._id === over.id)

        const dndOrderedColomns = arrayMove(orderedColums, oldColumnIndex, newColumnIndex)

        //const dndOrderedColomnsIds = dndOrderedColomns.map(c => c._id)
        //console.log('dndOrderedColomns', dndOrderedColomns)
        //console.log('dndOrderedColomnsIds', dndOrderedColomnsIds)

        setOrderedColumns(dndOrderedColomns)
      }
    }
    //sau khi thả item thi xoa het dữ liệu trong các state
    setActiveDagItemId(null)
    setActiveDagItemType(null)
    setActiveDagItemData(null)
    setOldColumDagingCard(null)
  }
  // animtion khi tha(drop) phan tu keo phan tu roi quan sat  overlay giu cho
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }
  //custom lai chien luoc/ thuat toan phat hien va cham roi toi uu keo tha card
  //giua nhieu columns
  const collisionDetectionStrategy = useCallback((args) => {
    //truong hop keo column thi dung closestCorners la chuan nha
    if (activeDagItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ... args })
    }
    // tim cac diem giao nhau, va cham - intersections voi con tro chuot
    const pointerIntersection = pointerWithin(args)
    if (!pointerIntersection?.length) return
    // thuat toan phat hien va cham se tra ve mot mang cac va cham o day
    //const intersections = !!pointerIntersection?.length ? pointerIntersection : rectIntersection(args)

    //tim overId dau tien trong pointerIntersection
    let overId = getFirstCollision(pointerIntersection, 'id')

    if ( overId) {
      //neu cai overId la column thi se tim toi cai cardId gan nhat tron khu vuc va cham
      //dua vao thuat toan phat hien va cham closestCorners
      const checkColumn = orderedColums.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDagItemType, orderedColums])

  return (
    <DndContext
      sensors={sensors}
      //thuat toan phat hien va cham collisionDetection (tu custom nang cao,  mac dinh cua dnd la closestCorners)
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handelDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <Box sx={{
        width: '100%',
        height: (theme) => (theme.trello.boardContentHeight),
        bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColums}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDagItemType) && null}
          {(activeDagItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDagItemData}/>}
          {(activeDagItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDagItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
