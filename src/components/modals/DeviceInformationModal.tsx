import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Button,
  Text,
  VStack,
  Box,
  Image,
  useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, SmallAddIcon } from '@chakra-ui/icons'
import { AddImageManualModal } from './addImageManualModal'
import { EditFeaturesModal } from './editFeaturesModal'
import { AddDocumentAsset } from './addDocumentAsset'
import { EditCloneDeviceModal } from './editCloneDeviceModal'
import { EditCustomersModal } from './editCustomersModal'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getDevices, makeProductCopy } from '../../redux/slices/products'
import { useNotifications } from '../../hooks/useNotifications'
import { AddDeviceModal } from './AddDeviceModal'

type Props = {
  onClose: () => void
  isOpen: boolean
  pageSize: number
  currentPage: number
}

const Edit = ({ onModalOpen }: { onModalOpen: () => void }) => (
  <Button
    py={0.5}
    px={2}
    borderRadius={4}
    ml={1}
    fontSize={14}
    onClick={onModalOpen}
  >
    <EditIcon mr={1} />
    Edit
  </Button>
)

const Add = ({ onModalOpen }: { onModalOpen: () => void }) => (
  <>
    <Text ml={1} fontWeight={600}>
      None
    </Text>
    <Button
      py={0.5}
      px={2}
      borderRadius={4}
      ml={1}
      fontSize={14}
      onClick={onModalOpen}
    >
      <SmallAddIcon mr={1} />
      Add
    </Button>
  </>
)

export const DeviceInformationModal = ({
  onClose, isOpen, pageSize, currentPage,
}: Props) => {
  const { device } = useAppSelector((state) => state.products.currentDevice)
  const { showSuccessMessage, showErrorMessage } = useNotifications()
  const dispatch = useAppDispatch()

  const {
    isOpen: addModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure()

  const {
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
    isOpen: isOpenEditModal,
  } = useDisclosure()

  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onClose: onImageModalClose,
  } = useDisclosure()
  const {
    isOpen: isManualOpen,
    onOpen: onManualOpen,
    onClose: onManualClose,
  } = useDisclosure()

  const {
    isOpen: isBookletOpen,
    onOpen: onBookletOpen,
    onClose: onBookletClose,
  } = useDisclosure()

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()

  const {
    isOpen: isCustomerOpen,
    onOpen: onCustomerOpen,
    onClose: onCustomerClose,
  } = useDisclosure()

  const openEditModal = () => {
    if (device?.reference_type.toLowerCase() === 'clone') {
      onEditOpen()
    } else {
      onAddModalOpen()
    }
  }

  const makeCopy = async () => {
    if (!device) return
    const resultAction = await dispatch(makeProductCopy(device.product.id))
    if (makeProductCopy.fulfilled.match(resultAction)) {
      showSuccessMessage('Copy successfully made.')
      await dispatch(getDevices({ size: `${pageSize}`, page: `${currentPage}` }))
      onClose()
    }

    if (makeProductCopy.rejected.match(resultAction)) {
      showErrorMessage('Could not make a copy')
    }
  }

  if (!device) return null

  return (
    <>
      <AddDeviceModal
        isOpen={addModalOpen}
        onClose={onAddModalClose}
        device={device}
        pageSize={pageSize}
        currentPage={currentPage}
      />
      <AddDocumentAsset
        url={device.documents?.manual || ''}
        isOpen={isManualOpen}
        onClose={onManualClose}
        type="manual"
      />
      <AddDocumentAsset
        url={device.documents?.booklet || ''}
        isOpen={isBookletOpen}
        onClose={onBookletClose}
        type="booklet"
      />
      <EditCloneDeviceModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        device={device}
      />
      <EditCustomersModal
        isOpen={isCustomerOpen}
        onClose={onCustomerClose}
        device={device}
        type={device.reference_type}
      />
      <AddImageManualModal
        key={device.id}
        onClose={onImageModalClose}
        isOpen={isImageModalOpen}
        isParent={device.reference_type === 'parent'}
        id={device.id}
        productId={device.product.id}
        referenceId={device.reference_id}
        mainImage={device.documents?.main_image || ''}
        portraitImage={device.product.faceplate?.portrait_image || ''}
        landscapeImage={device.product.faceplate?.landscape_image || ''}
        portrait={{
          x: device.product.faceplate?.portrait_x,
          y: device.product.faceplate?.portrait_y,
          width: device.product.faceplate?.portrait_width,
          height: device.product.faceplate?.portrait_height,
        }}
        landscape={{
          x: device.product.faceplate?.landscape_x,
          y: device.product.faceplate?.landscape_y,
          width: device.product.faceplate?.landscape_width,
          height: device.product.faceplate?.landscape_height,
        }}
      />
      <Modal onClose={onClose} isOpen={isOpen} size="xl" isCentered>
        <ModalOverlay bgColor="#2D343680" backdropFilter="blur(10px)" />
        <ModalContent p={8}>
          <ModalHeader p={0} mb={8}>
            <Text fontSize={18} fontWeight={600}>
              {`${device.product.manufacturer.name} ${device.product.name}`}
            </Text>
          </ModalHeader>
          <ModalBody p={0}>
            <Flex justifyContent="space-between" alignItems="stretch">
              <Flex direction="column" fontSize={14}>
                <Flex mb={2}>
                  <Text>Primary Key:</Text>
                  <Text ml={1} fontWeight={600}>
                    {device.serial}
                  </Text>
                </Flex>
                <Flex mb={2}>
                  <Text>Name:</Text>
                  <Text ml={1} fontWeight={600}>
                    {device.product.name}
                  </Text>
                </Flex>
                <Flex mb={2}>
                  <Text>Manufacturer:</Text>
                  <Text ml={1} fontWeight={600}>
                    {device.product.manufacturer.name}
                  </Text>
                </Flex>
                <Flex mb={2}>
                  <Text>Carrier:</Text>
                  <Text ml={1} fontWeight={600}>{device.carrier.name}</Text>
                </Flex>
                <Flex mb={2}>
                  <Text>Reference Type:</Text>
                  <Text ml={1} fontWeight={600}>
                    {device.reference_type}
                  </Text>
                </Flex>
                <Flex mb={2}>
                  <Text>Product Type:</Text>
                  <Text ml={1} fontWeight={600}>
                    {device.product.type.name}
                  </Text>
                </Flex>
                <Flex mb={2}>
                  <Text>Parent Id:</Text>
                  <Text ml={1} fontWeight={600}>
                    {device.product.id}
                  </Text>
                </Flex>
                <Flex mb={2}>
                  <Text>Customer ID:</Text>
                  <Text ml={1} fontWeight={600}>{device.reference_id}</Text>
                </Flex>
                <Flex mb={2}>
                  <Text
                    textDecoration={device.documents?.manual ? 'underline' : 'none'}
                    color={device.documents?.manual ? 'blue.500' : 'inherit'}
                    fontWeight={device.documents?.manual ? 600 : 400}
                  >
                    Manual Location:
                  </Text>
                  {
                    !device.documents?.manual
                      ? <Add onModalOpen={onManualOpen} />
                      : <Edit onModalOpen={onManualOpen} />
                  }
                </Flex>
                <Flex mb={2}>
                  <Text
                    textDecoration={device.documents?.booklet ? 'underline' : 'none'}
                    color={device.documents?.booklet ? 'blue.500' : 'inherit'}
                    fontWeight={device.documents?.booklet ? 600 : 400}
                  >
                    Booklet Location:
                  </Text>
                  {
                    !device.documents?.booklet
                      ? <Add onModalOpen={onBookletOpen} />
                      : <Edit onModalOpen={onBookletOpen} />
                  }
                </Flex>
                <VStack mt={10} w={184}>
                  <Button
                    w="full"
                    variant="outlined_button"
                    onClick={openEditModal}
                  >
                    Edit Device
                  </Button>
                  <Button
                    w="full"
                    variant="outlined_button"
                    onClick={onCustomerOpen}
                  >
                    Edit Customers
                  </Button>
                  {device.reference_type.toLowerCase() === 'parent' ? (
                    <>
                      <Button
                        w="full"
                        variant="outlined_button"
                        onClick={onOpenEditModal}
                      >
                        Edit Features
                      </Button>
                      <Button
                        w="full"
                        variant="outlined_button"
                        borderColor="gray.200"
                        onClick={makeCopy}
                      >
                        Make a Copy
                      </Button>
                    </>
                  ) : null}
                </VStack>
              </Flex>
              <VStack justifyContent="space-between">
                <Box maxW={200} w="full" h="auto">
                  {
                    device.documents?.main_image ? (
                      <Image
                        src={device.documents?.main_image.split('?')[0]}
                        boxSize="full"
                      />
                    ) : (
                      <Box
                        bg="blue.50"
                        w="full"
                        h={360}
                        borderRadius={20}
                      />
                    )
                  }
                </Box>
                <Button variant="outlined_button" onClick={onImageModalOpen}>
                  <AddIcon mr={4} />
                  Add Images
                </Button>
              </VStack>
            </Flex>
            <EditFeaturesModal
              isOpen={isOpenEditModal}
              onClose={onCloseEditModal}
              productId={device.product.id}
            />
          </ModalBody>
          <ModalFooter p={0} mt={8}>
            <Button
              variant="outlined_button"
              w="fit-content"
              h="auto"
              py={4}
              px={8}
              borderColor="gray.200"
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
