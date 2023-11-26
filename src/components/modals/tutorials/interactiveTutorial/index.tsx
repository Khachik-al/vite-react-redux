import {
  Container,
  Flex,
  Heading,
  Image,
  Input,
  ListItem,
  Modal,
  ModalContent,
  ModalOverlay,
  OrderedList,
  Text,
} from '@chakra-ui/react'
import { ChangeEvent, useRef, useState } from 'react'
import { Step } from '../../../../interfaces/tutorials.interface'

export const InteractiveTutorial = ({
  stepsTutorial,
  handleStepsTutorialChange,
  removeUploadedImage,
  createStepOnImageUpload,
  isOpen,
  onOpen,
  onClose,
}: {
  stepsTutorial: Step[]
  handleStepsTutorialChange: (prev: Step[]) => void
  removeUploadedImage: (id: number) => void
  createStepOnImageUpload: (e: ChangeEvent<HTMLInputElement>) => void
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) => {
  const [isDraggableItem, setIsDraggableItem] = useState({
    index: -1,
    state: false,
  })

  const [index, setIndex] = useState(0)
  const dragItem: { current: number | null | undefined } = useRef()
  const dragOverItem: { current: number | null | undefined } = useRef()

  const onDragStart = (position: number) => {
    dragItem.current = position
  }

  const onDragEnter = (position: number) => {
    setIsDraggableItem({ index: position, state: true })
    dragOverItem.current = position
  }

  const onDragEnd = () => {
    const copyListItems = [...stepsTutorial]
    if (typeof dragItem.current === 'number' && typeof dragOverItem.current === 'number') {
      const dragItemContent = copyListItems[dragItem.current]
      copyListItems.splice(dragItem.current, 1)
      copyListItems.splice(dragOverItem.current, 0, dragItemContent)
      dragItem.current = null
      dragOverItem.current = null
    }
    setIsDraggableItem({ index: -1, state: false })
    handleStepsTutorialChange(copyListItems)
  }
  const handleOpenImage = (i: number) => {
    setIndex(i)
    onOpen()
  }

  return (
    <Flex direction="column">
      <Container variant="zipFile" p={5} width={40}>
        <label
          htmlFor="input__file"
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            width: 'full',
            height: 'full',
            cursor: 'pointer',
          }}
        >
          {' '}
          <Input
            key={stepsTutorial.length}
            type="file"
            name="file"
            multiple
            accept=".jpg, .jpeg, .png"
            id="input__file"
            onChange={createStepOnImageUpload}
          />
          <Image src="/assets/images/document-upload.png" />
          <Text fontSize="xs" fontWeight="700">
            Upload Images
          </Text>
        </label>
      </Container>
      {stepsTutorial.length > 0 && (
        <Heading as="h3" pt={8} variant="title">
          Uploaded Images:
        </Heading>
      )}
      <OrderedList>
        {stepsTutorial.map((item: Step, i) => (
          <Container
            key={item.order}
            transition=".2s all ease"
            variant={
              isDraggableItem.index !== i && isDraggableItem.state
                ? 'dashedContainer'
                : 'default'
            }
          >
            <ListItem
              key={item.order}
              bgColor="blue.50"
              w="max-content"
              h={7}
              ml={4}
              borderRadius="md"
              draggable
              onDragStart={() => onDragStart(i)}
              onDragEnter={() => onDragEnter(i)}
              onDragEnd={onDragEnd}
            >
              <Flex
                align="center"
                justify="space-between"
                p="1"
                gap={3}
                overflow="hidden"
                wordBreak="break-all"
              >
                <Image
                  src="/assets/images/close.png"
                  cursor="pointer"
                  onClick={() => removeUploadedImage(i)}
                />
                <Text
                  color="blue.500"
                  h="5"
                  cursor="pointer"
                  onClick={() => handleOpenImage(i)}
                >
                  {item.filePath.fileName}
                </Text>
              </Flex>
            </ListItem>
            {isDraggableItem.index !== i && isDraggableItem.state && (
              <Text color="gray.100" ml={5}>
                drop here
              </Text>
            )}
          </Container>
        ))}
      </OrderedList>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <Image src={stepsTutorial[index]?.filePath.fileImg} />
        </ModalContent>
      </Modal>
    </Flex>
  )
}
