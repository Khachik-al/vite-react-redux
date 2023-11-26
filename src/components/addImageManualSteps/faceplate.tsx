import {
  Box, Button, Container, Flex, HStack, Image, Input, Text,
} from '@chakra-ui/react'
import { ChangeEvent } from 'react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'

type FileState = {
  myFile: File | null
  filename: string
}

type Props = {
  type: string
  selectedFile: FileState
  setSelectedFile: (p: FileState) => void
  imageUrl: string
}

export const Faceplate = ({
  type, selectedFile, setSelectedFile, imageUrl,
}: Props) => {
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
        <Button
          px={2}
          py={2.5}
          w="fit-content"
          borderRadius={8}
          leftIcon={<CheckIcon mr={2} />}
        >
          Faceplate Behind
        </Button>
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
        >
          {
            selectedFile.myFile ? (
              <Image
                src={URL.createObjectURL(selectedFile.myFile)}
                w={type === 'landscape' ? 'auto' : 'full'}
                h={type === 'landscape' ? 'full' : 'auto'}
                maxW="full"
                maxH="full"
              />
            ) : imageUrl && (
            <Image
              src={imageUrl}
              w={type === 'landscape' ? 'auto' : 'full'}
              h={type === 'landscape' ? 'full' : 'auto'}
              maxW="full"
              maxH="full"
            />
            )
          }
        </Box>
      </Box>
    </HStack>
  )
}
