import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Box,
  Accordion,
  Button,
  useDisclosure,
  Tr,
  Td,
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { SortType, Table } from '../table/Table'
import { CloneDevicesTableRow } from '../table/CloneDevicesTableRow'
import { AddDeviceAccordion } from '../addDevice/AddDeviceAccordion'
import { DeleteDeviceModal } from './DeleteDeviceModal'
import { ParentDevice } from '../addDevice/AddParentDevicePanel'
import { CloneDevice, NewDevice, SingleProduct } from '../../interfaces/data.interface'
import { useAppDispatch } from '../../redux/hooks'
import {
  addDevice,
  changeParentDevice,
  getDevices,
  getSingleDevice,
} from '../../redux/slices/products'
import { useNotifications } from '../../hooks/useNotifications'
import { mapToCloneDeivce } from '../../utils/helper'

type Props = {
  isOpen: boolean
  onClose: () => void
  device: SingleProduct | null
  pageSize: number
  currentPage: number
}

type FileState = {
  myFile: File | null
  fileName: string
}

const addDeviceColumns = [
  {
    title: 'Customer Id',
    isSortable: true,
    key: 'customerId',
  },
  {
    title: 'Carrier',
    isSortable: true,
    key: 'carrier',
  },
  {
    title: 'Language',
    isSortable: true,
    key: 'language',
  },
  {
    title: 'Action',
    isSortable: false,
    key: 'action',
  },
]

export const AddDeviceModal = ({
  isOpen, onClose, device, pageSize, currentPage,
}: Props) => {
  const {
    isOpen: deleteModalIsOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure()
  const dispatch = useAppDispatch()
  const { showSuccessMessage, showErrorMessage } = useNotifications()
  const [sort, setSort] = useState<SortType>(({ sortKey: 'customerId', order: 'ASC' }))
  const [cloneDevices, setCloneDevices] = useState<CloneDevice[]>(
    mapToCloneDeivce(
      device?.product.references.filter((r) => r.reference_type === 'clone')
        || [],
    ),
  )
  const [parentDevice, setParentDevice] = useState<ParentDevice>({
    name: device?.product.name || '',
    referenceId: device?.reference_id || '',
    manufacturerId: device?.product.manufacturer.id || '',
    carrierId: device?.carrier.id || '',
    typeId: device?.product.type.id || '',
    newManufacturer: '',
    newCarrier: '',
    customerIds: device
      ? device.product.customers.map((c) => c.id)
      : [],
  })
  const [selectedFile, setSelectedFile] = useState<FileState>({
    myFile: null,
    fileName: '',
  })
  const [selectedCloneId, setSelectedCloneId] = useState('')

  const deleteSelectedFile = () => setSelectedFile({
    myFile: null,
    fileName: '',
  })

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile({ myFile: file, fileName: file.name })
  }

  const addNewDevice = async (newDevice: NewDevice) => {
    const resultAction = await dispatch(addDevice(newDevice))
    if (addDevice.fulfilled.match(resultAction)) {
      const result = resultAction.payload
      if (result.error) {
        showErrorMessage(`${result.error}: ${result.message}`)
      } else {
        showSuccessMessage(result.message)
      }
    }
  }

  const editDevice = async (newDevice: NewDevice) => {
    const resultAction = await dispatch(changeParentDevice(
      { body: newDevice, id: device?.product.id || '' },
    ))
    if (changeParentDevice.fulfilled.match(resultAction)) {
      const result = resultAction.payload
      if (result.error) {
        showErrorMessage(`${result.error}: ${result.message}`)
      } else {
        showSuccessMessage(result.message)
      }
    }
  }

  const handleSave = async () => {
    if (!parentDevice.referenceId || !parentDevice.name) return
    const customerIds = [...parentDevice.customerIds]

    cloneDevices.forEach((clone) => {
      clone.customers.forEach((c) => {
        if (!customerIds.includes(c.id)) {
          customerIds.push(c.id)
        }
      })
    })

    const newDevice: NewDevice = {
      referenceId: parentDevice.referenceId,
      customerIds,
      name: parentDevice.name,
      typeId: parentDevice.typeId,
      manufacturerId: parentDevice.manufacturerId,
      carrierId: parentDevice.carrierId,
      references: cloneDevices,
    }

    if (!device) {
      await addNewDevice(newDevice)
      onClose()
    } else {
      await editDevice(newDevice)
      dispatch(getSingleDevice(device.id))
    }

    dispatch(getDevices({ size: `${pageSize}`, page: `${currentPage}` }))
    setParentDevice({
      name: '',
      referenceId: '',
      manufacturerId: '',
      carrierId: '',
      typeId: '',
      newManufacturer: '',
      newCarrier: '',
      customerIds: [],
    })
    setCloneDevices([])
    setSelectedFile({
      myFile: null,
      fileName: '',
    })
  }

  const deleteReference = (referenceId: string) => {
    setCloneDevices(
      [...cloneDevices.filter((c) => c.referenceId !== referenceId)],
    )
    onDeleteModalClose()
  }

  const handleDelete = (rId: string) => {
    setSelectedCloneId(rId)
    onDeleteModalOpen()
  }

  return (
    <>
      <DeleteDeviceModal
        isOpen={deleteModalIsOpen}
        onClose={onDeleteModalClose}
        title="Delete Product ?"
        message="You are about to delete ?"
        callback={() => deleteReference(selectedCloneId)}
        disabled={false}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent my={3} maxW={1300} w="90%">
          <ModalHeader>{device ? 'Edit Device' : 'Add Device'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex height={528} justifyContent="space-between" gap={4}>
              <Box w="-webkit-fill-available">
                <Accordion border={0} defaultChecked defaultIndex={0}>
                  <AddDeviceAccordion
                    selectedFile={selectedFile}
                    handleFileUpload={handleFileUpload}
                    deleteSelectedFile={deleteSelectedFile}
                    cloneDevices={cloneDevices}
                    setCloneDevices={setCloneDevices}
                    parentDevice={parentDevice}
                    setParentDevice={setParentDevice}
                  />
                </Accordion>
              </Box>
              <Box w="-webkit-fill-available" maxH={520} overflowY="auto">
                <Table columns={addDeviceColumns} sort={sort} setSort={setSort}>
                  {
                    !cloneDevices.length
                      ? (
                        <Tr>
                          <Td>No data available</Td>
                        </Tr>
                      )
                      : (
                        <>
                          {
                            cloneDevices.map((cloneDevice) => (
                              <CloneDevicesTableRow
                                key={cloneDevice.referenceId}
                                device={cloneDevice}
                                handleDelete={handleDelete}
                              />
                            ))
                          }
                        </>
                      )
                  }
                </Table>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter mt={8}>
            <Flex justifyContent="end">
              <Flex gap={4}>
                <Button
                  variant="secondary_button"
                  px={8}
                  py={4}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  px={8}
                  py={4}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
