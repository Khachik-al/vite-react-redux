import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  Input,
  ModalFooter,
  Button,
  Text,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ChangeEvent, FC } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  save: () => void
  value: string | undefined
  setValue: (e: ChangeEvent<HTMLInputElement>) => void
}

export const HTMLFileModal: FC<Props> = ({
  isOpen,
  onClose,
  save,
  value,
  setValue,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader />
      <ModalCloseButton />
      <ModalBody>
        <Text fontSize="lg" fontWeight="700" mb="6">
          Change URL
        </Text>
        <Input value={value} onChange={(e) => setValue(e)} />
      </ModalBody>
      <ModalFooter>
        <Button
          variant="button_ordinary"
          bgColor="inherit"
          color="gray.50"
          border="1px solid"
          borderColor="gray.50"
          _hover={{ borderColor: 'gray.200', color: 'gray.200' }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button onClick={save} variant="button_ordinary">
          Save
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)
