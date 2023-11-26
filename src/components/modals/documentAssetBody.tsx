import {
  Box, Button,
  Container,
  Flex,
  Input,
  ModalBody, ModalFooter,
  Text,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { ChangeEvent } from 'react'
import { useAppDispatch } from '../../redux/hooks'
import { useNotifications } from '../../hooks/useNotifications'
import { addAsset, getSingleDevice, updateDocumentAsset } from '../../redux/slices/products'

type Props = {
  link: string
  selectedFile: {
    myFile: File | null
    filename: string
  }
  deleteSelectedFile: () => void
  handleLinkChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  productId: string
  deviceId: string
  type: string
}

export const DocumentAssetBody = ({
  handleFileUpload,
  selectedFile,
  deleteSelectedFile,
  link,
  handleLinkChange,
  onClose,
  productId,
  deviceId,
  type,
}: Props) => {
  const dispatch = useAppDispatch()
  const { showErrorMessage, showSuccessMessage } = useNotifications()

  const updateDocument = async (url: string) => {
    const action = await dispatch(updateDocumentAsset(
      {
        type,
        url,
        productId: type === 'parent'
          ? productId
          : deviceId,
      },
    ))
    if (updateDocumentAsset.fulfilled.match(action)) {
      dispatch(getSingleDevice(deviceId))
      showSuccessMessage('Asset uploaded successfully')
    }
    if (updateDocumentAsset.rejected.match(action)) {
      showErrorMessage('Could not upload asset')
    }
  }

  const handleSave = async () => {
    if (link) {
      updateDocument(link)
      onClose()
      return
    }
    try {
      const resultAction = await dispatch(addAsset(selectedFile))
      if (addAsset.fulfilled.match(resultAction)) {
        const uploadUrl = resultAction.payload
        updateDocument(uploadUrl)
      }
      if (addAsset.rejected.match(resultAction)) {
        showErrorMessage('Could not upload asset.')
      }
    } finally {
      deleteSelectedFile()
      onClose()
    }
  }

  return (
    <>
      <ModalBody>
        <Flex
          pb={4}
          mb={4}
          borderBottom="1px solid"
          borderColor="gray.50"
          justifyContent="start"
          alignItems="center"
          gap={4}
        >
          <Container m={0} variant="manual-image">
            <Input
              type="file"
              accept="application/pdf"
              py={3}
              px={8}
              onChange={handleFileUpload}
            />
          </Container>
          {selectedFile.filename && (
            <Flex
              alignItems="center"
              bg="blue.50"
              p={2}
              borderRadius={4}
              color="gray.200"
              w="fit-content"
              h="fit-content"
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
          )}
        </Flex>
        <Box>
          <Text fontWeight={600} mb={2}>
            Manual Link
          </Text>
          <Input
            value={link}
            onChange={handleLinkChange}
          />
        </Box>
      </ModalBody>
      <ModalFooter>
        <Flex gap={4}>
          <Button
            px={8}
            py={4}
            variant="secondary_button"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            px={8}
            py={4}
            onClick={handleSave}
          >
            Save
          </Button>
        </Flex>
      </ModalFooter>
    </>
  )
}
