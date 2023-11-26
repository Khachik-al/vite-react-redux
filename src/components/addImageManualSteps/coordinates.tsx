import {
  Box, Flex, HStack, Image, Text,
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'

type FileState = {
  myFile: File | null
  filename: string
}

type Coords = {
  x: number
  y: number
  width: number
  height: number
}

type Props = {
  type: string
  selectedFile: FileState
  coords: Coords
  setCoords: (c: Coords) => void
  imageUrl: string
}

type ValueChangeProps = {
  handleCoordsChange: (keyname: keyof Coords, method: 'plus' | 'minus') => void
  coords: Coords
  value: keyof Coords
}

const ValueChangeButtons = ({ handleCoordsChange, coords, value }: ValueChangeProps) => (
  <Flex alignItems="center" gap={2} minW={240}>
    <Text fontWeight={600}>{`${value} = ${coords[value]}`}</Text>
    <Flex gap={1}>
      <AddIcon
        cursor="pointer"
        boxSize={4}
        bg="gray.100"
        color="main_white"
        p={1}
        borderRadius={12}
        onClick={() => handleCoordsChange(value, 'plus')}
      />
      <MinusIcon
        cursor="pointer"
        boxSize={4}
        bg="gray.100"
        color="main_white"
        p={1}
        borderRadius={12}
        onClick={() => handleCoordsChange(value, 'minus')}
      />
    </Flex>
  </Flex>
)

export const Coordinates = ({
  type, selectedFile, coords, setCoords, imageUrl,
}: Props) => {
  const [grabCoords, setGrabCoords] = useState({
    x: 0,
    y: 0,
  })
  const parentRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)

  const parentWidth = +(parentRef?.current?.getBoundingClientRect().width || 0).toFixed()
  const parentHeight = +(parentRef?.current?.getBoundingClientRect().height || 0).toFixed()

  const childWidth = +(childRef?.current?.getBoundingClientRect().width || 0).toFixed()
  const childheight = +(childRef?.current?.getBoundingClientRect().height || 0).toFixed()

  const handleCoordsChange = (keyname: keyof Coords, method: 'plus' | 'minus') => {
    if (!selectedFile.myFile && !imageUrl) return
    const value = method === 'plus' ? coords[keyname] + 1 : coords[keyname] - 1

    if ((childWidth > parentWidth) || (childheight > parentHeight)) return
    if (keyname === 'width' && (value > parentWidth)) return
    if (keyname === 'height' && (value > parentHeight)) return

    setCoords({
      ...coords,
      [keyname]: (value >= 0) ? value : coords[keyname],
    })
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setGrabCoords({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const parentRect = parentRef?.current?.getBoundingClientRect()
    const childRect = childRef?.current?.getBoundingClientRect()
    if (!parentRect || !childRect) return

    const grabX = +(grabCoords.x - childRect.x).toFixed()
    const grabY = +(grabCoords.y - childRect.y).toFixed()

    const newXCoord = +(e.clientX - parentRect.left - grabX).toFixed()
    const newYCoord = +(e.clientY - parentRect.top - grabY).toFixed()

    if (newXCoord <= 0 || newYCoord <= 0) return
    if (
      newXCoord + childRect.width > parentRect.width
      || newYCoord + childRect.height > parentRect.height
    ) return
    setCoords({
      ...coords,
      x: newXCoord,
      y: newYCoord,
    })
  }

  const handleResize = () => {
    const width = +(childRef?.current?.getBoundingClientRect().width || coords.width).toFixed()
    const height = +(childRef?.current?.getBoundingClientRect().height || coords.height).toFixed()

    setCoords({
      ...coords,
      width,
      height,
    })
  }

  return (
    <HStack userSelect="none" mt={8} spacing={30}>
      <Flex gap={4} direction="column" pr={10}>
        {
          (Object.keys(coords) as (keyof typeof coords)[]).map((value) => (
            <ValueChangeButtons
              key={value}
              value={value}
              handleCoordsChange={handleCoordsChange}
              coords={coords}
            />
          ))
        }
      </Flex>
      <Box
        py={type === 'landscape' ? 20 : ''}
        w={type === 'landscape' ? 400 : 200}
        ml={0}
      >
        <Box
          w={type === 'landscape' ? 400 : 200}
          h={type === 'landscape' ? 200 : 400}
          bg={!selectedFile.myFile ? 'blue.50' : ''}
          borderRadius={30}
          position="relative"
          ref={parentRef}
        >
          {
            (selectedFile.myFile || imageUrl) && (
              <>
                <Image
                  src={
                    selectedFile.myFile
                      ? URL.createObjectURL(selectedFile.myFile)
                      : imageUrl
                  }
                  w={type === 'landscape' ? 'auto' : 'full'}
                  h={type === 'landscape' ? 'full' : 'auto'}
                  maxW="full"
                  maxH="full"
                />
                <Box
                  draggable
                  onDragEnd={handleDragEnd}
                  onDragStart={handleDragStart}
                  onMouseUp={handleResize}
                  resize="both"
                  overflow="auto"
                  cursor="move"
                  border="2px dashed"
                  borderColor="gray.50"
                  position="absolute"
                  w={`${coords.width}px`}
                  h={`${coords.height}px`}
                  left={`${coords.x}px`}
                  top={`${coords.y}px`}
                  ref={childRef}
                  maxW={parentWidth - coords.x}
                  maxH={parentHeight - coords.y}
                />
              </>
            )
          }
        </Box>
      </Box>
    </HStack>
  )
}
