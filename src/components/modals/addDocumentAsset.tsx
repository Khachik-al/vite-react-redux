import { ChangeEvent, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
} from '@chakra-ui/react'
import { DocumentAssetBody } from './documentAssetBody'
import { useAppSelector } from '../../redux/hooks'

type SelectedFile = {
  myFile: File | null;
  filename: string;
}

type Props = {
  isOpen: boolean
  onClose: () => void
  url: string
  type: 'manual' | 'booklet'
}

export const AddDocumentAsset = ({
  isOpen, onClose, url, type,
}: Props) => {
  const [link, setLink] = useState(url)
  const [selectedFile, setSelectedFile] = useState<SelectedFile>({
    myFile: null,
    filename: '',
  })
  const { device } = useAppSelector((state) => state.products.currentDevice)

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile({ myFile: file, filename: file.name })
    setLink('')
  }

  const deleteSelectedFile = () => {
    setSelectedFile({
      myFile: null,
      filename: '',
    })
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent minW={500}>
        <ModalHeader>
          {`${url ? 'Edit' : 'Add'} ${type === 'manual' ? 'Manual' : 'Booklet'}`}
        </ModalHeader>
        <ModalCloseButton />
        <DocumentAssetBody
          deviceId={device?.id || ''}
          productId={device?.product.id || ''}
          link={link}
          type={type}
          selectedFile={selectedFile}
          deleteSelectedFile={deleteSelectedFile}
          handleLinkChange={handleLinkChange}
          handleFileUpload={handleFileUpload}
          onClose={onClose}
        />
      </ModalContent>
    </Modal>
  )
}
