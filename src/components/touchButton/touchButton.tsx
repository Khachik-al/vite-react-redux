import { Container } from '@chakra-ui/react'
import { DragEvent } from 'react'

type MouseMove = {
  downX: number
  leaveX: number
  movingX: number
  downY: number
  leaveY: number
  movingY: number
}
interface Touch {
  transform: string
  top: string
  toLeft: string
  swipe: string
  nextStep: () => void
  setMouseMove: (value: (value: MouseMove) => MouseMove) => void
}

export const TouchButton = ({
  transform,
  top,
  toLeft,
  swipe,
  nextStep,
  setMouseMove,
}: Touch) => {
  const dragStart = (e: DragEvent<HTMLInputElement>) => {
    setMouseMove((prev) => ({ ...prev, downX: e.clientX, downY: e.clientY }))
  }

  const dragEnd = (e: DragEvent<HTMLInputElement>) => {
    setMouseMove((prev) => ({
      ...prev,
      leaveX: e.clientX,
      movingX: -(prev.downX - e.clientX),
      movingY: -(prev.downY - e.clientY),
    }))
  }

  return (
    <Container
      display={swipe === 'automate' ? 'none' : ''}
      transform={transform}
      position="absolute"
      zIndex={5}
      bgColor="white"
      border="3px solid"
      borderColor="black"
      borderRadius={60}
      w={5}
      p={0}
      minW={0}
      transition="0.4s all ease"
      height={5}
      top={top}
      left={toLeft}
      cursor="grab"
      draggable
      onClick={nextStep}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
    />
  )
}
