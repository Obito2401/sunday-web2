import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import { DndContext,
  //PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'

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

  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handelDragend = (event) => {
    //console.log('handelDragend', event)
    const { active, over } = event

    //kiem tra neu khong co over(keo ra ngoai) thi return de tranh loi
    if (!over) {
      return
    }
    if (active.id !== over.id) {
      //lay vi tri cu cua active
      const oldIndex = orderedColums.findIndex(c => c._id === active.id)
      //lay vi tri moi
      const newIndex = orderedColums.findIndex(c => c._id === over.id)
      const dndOrderedColomns = arrayMove(orderedColums, oldIndex, newIndex)

      //const dndOrderedColomnsIds = dndOrderedColomns.map(c => c._id)
      //console.log('dndOrderedColomns', dndOrderedColomns)
      //console.log('dndOrderedColomnsIds', dndOrderedColomnsIds)

      setOrderedColumns(dndOrderedColomns)
    }
  }
  return (
    <DndContext onDragEnd={handelDragend} sensors={sensors}>
      <Box sx={{
        width: '100%',
        height: (theme) => (theme.trello.boardContentHeight),
        bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColums}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent
