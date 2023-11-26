import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Text, Flex, Button, Spinner,
} from '@chakra-ui/react'

type Props = {
  onClose: () => void
  isOpen: boolean
  title: string
  message: string
  callback: () => any
  disabled: boolean
}

export const DeleteDeviceModal = ({
  onClose, isOpen, title, message, callback, disabled,
}: Props) => (
  <Modal onClose={onClose} isOpen={isOpen} isCentered>
    <ModalOverlay />
    <ModalContent p={8} w="auto">
      <ModalHeader p={0}>
        <Text
          fontSize={18}
          fontWeight={600}
        >
          {title}
        </Text>
        <Text
          mt={1}
          fontSize={12}
          fontWeight={400}
        >
          {message}
        </Text>
      </ModalHeader>
      <ModalBody mt={6} p={0}>
        <Flex gap={4}>
          <Button
            variant="cancel"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            isDisabled={disabled}
            onClick={() => { callback() }}
            variant="save"
          >
            Delete
            {disabled && (<Spinner ml={2} color="white" />)}
          </Button>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
)
