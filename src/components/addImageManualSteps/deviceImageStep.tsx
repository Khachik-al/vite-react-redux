import {
  Box, Container, Flex, HStack, Image, Input, Text,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { ChangeEvent } from 'react'

type FileState = {
  myFile: File | null
  filename: string
}

type Props = {
  selectedFile: FileState
  setSelectedFile: (p: FileState) => void
  imageUrl: string
}

export const DeviceImageStep = ({ selectedFile, setSelectedFile, imageUrl }: Props) => {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile({ myFile: file, filename: file.name })
  }

  const deleteSelectedFile = () => setSelectedFile({
    myFile: null,
    filename: '',
  })

  return (
    <HStack mt={8} spacing={30}>
      <Flex gap={4} direction="column">
        <Container variant="manual-image">
          <Input
            type="file"
            onChange={handleFileUpload}
          />
        </Container>
        {
          selectedFile.filename
          && (
            <Flex
              alignItems="center"
              bg="blue.50"
              p={2}
              borderRadius={4}
              color="gray.200"
              w="fit-content"
            >
              <CloseIcon
                cursor="pointer"
                boxSize={2.5}
                mr={2}
                onClick={deleteSelectedFile}
              />
              <Text title={selectedFile.filename}>
                {
                  selectedFile.filename.length > 20
                    ? `${selectedFile.filename.slice(0, 20)}...`
                    : selectedFile.filename
                }
              </Text>
            </Flex>
          )
        }
      </Flex>
      <Box>
        <Box
          w={200}
          h={400}
          bg={!selectedFile.myFile ? 'blue.50' : ''}
          borderRadius={20}
        >
          {
            selectedFile.myFile ? (
              <Image
                src={URL.createObjectURL(selectedFile.myFile)}
                w="full"
                h="auto"
                maxW="full"
                maxH="full"
              />
            ) : imageUrl && (
            <Image
              src={imageUrl}
            />
            )
          }
        </Box>
      </Box>
    </HStack>
  )
}
