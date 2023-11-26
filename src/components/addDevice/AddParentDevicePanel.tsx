import {
  Box, Container, Flex, Input, Select, Text,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { ChangeEvent, SyntheticEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addNewManufacturer, postNewCarrier } from '../../redux/slices/metadata'
import { useNotifications } from '../../hooks/useNotifications'

type Props = {
  selectedFile: {
    myFile: File | null
    fileName: string
  }
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void
  deleteSelectedFile: () => void
  parentDevice: ParentDevice
  setParentDevice: (p: ParentDevice) => void
}

export type ParentDevice = {
  name: string
  referenceId: string
  manufacturerId: string
  carrierId: string
  typeId: string
  newManufacturer: string
  newCarrier: string
  customerIds: string[]
}

export const AddParentDevicePanel = ({
  selectedFile,
  handleFileUpload,
  deleteSelectedFile,
  parentDevice,
  setParentDevice,
}: Props) => {
  const dispatch = useAppDispatch()
  const { metadata } = useAppSelector((state) => state.metadata)
  const { showSuccessMessage, showErrorMessage } = useNotifications()

  const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setParentDevice({
      ...parentDevice,
      [e.target.name]: e.target.value,
    })
  }

  const onCarrierSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const resultAction = await dispatch(postNewCarrier(parentDevice.newCarrier))
    if (postNewCarrier.fulfilled.match(resultAction)) {
      const { payload } = resultAction
      if (payload.error) {
        showErrorMessage('Failed to add carrier')
      } else {
        showSuccessMessage('Carrier successfully added')
      }
    }

    setParentDevice({ ...parentDevice, newCarrier: '' })
  }

  const onManufacturerSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    if (!selectedFile.myFile) return

    const resultAction = await dispatch(
      addNewManufacturer({
        selectedFile,
        newManufacturer: parentDevice.newManufacturer,
      }),
    )

    if (addNewManufacturer.fulfilled.match(resultAction)) {
      const result = resultAction.payload
      if (!result.error) {
        showSuccessMessage('Manufacturer successfully added')
      } else {
        showErrorMessage('Could not add manufacturer')
      }
    }

    setParentDevice({
      ...parentDevice,
      newManufacturer: '',
    })
    deleteSelectedFile()
  }

  return (
    <Flex justifyContent="space-between">
      <Box w="50%">
        <Box w="90%" mb={4}>
          <Text fontWeight={600} mb={2}>Product Name</Text>
          <Input
            placeholder="Product Name"
            name="name"
            value={parentDevice.name}
            onChange={onInputChange}
          />
        </Box>
        <Box w="90%" mb={4}>
          <Text fontWeight={600} mb={2}>Customer ID</Text>
          <Input
            placeholder="Customer ID"
            name="referenceId"
            value={parentDevice.referenceId}
            onChange={onInputChange}
          />
        </Box>
        <Box w="90%" mb={4}>
          <Text fontWeight={600} mb={2}>Product Type</Text>
          <Select
            name="typeId"
            value={parentDevice.typeId}
            onChange={onInputChange}
          >
            <option value="">Select Type</option>
            {
              metadata.productTypes?.map((productType) => (
                <option key={productType.id} value={productType.id}>{productType.name}</option>
              ))
            }
          </Select>
        </Box>
        <form onSubmit={onCarrierSubmit}>
          <Box w="90%" mb={4}>
            <Text fontWeight={600} mb={2}>New Carrier</Text>
            <Input
              placeholder="New Carrier"
              name="newCarrier"
              bg="blue.50"
              value={parentDevice.newCarrier}
              onChange={onInputChange}
            />
          </Box>
        </form>
      </Box>
      <Box w="50%">
        <Box w="90%" mb={4}>
          <Text fontWeight={600} mb={2}>Manufacturer</Text>
          <Select
            name="manufacturerId"
            value={parentDevice.manufacturerId}
            onChange={onInputChange}
          >
            <option value="">Select Manufacturer</option>
            {
              metadata.manufacturers?.map((manufacturer) => (
                <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</option>
              ))
            }
          </Select>
        </Box>
        <Box w="90%" mb={4}>
          <Text fontWeight={600} mb={2}>Carrier</Text>
          <Select
            name="carrierId"
            value={parentDevice.carrierId}
            onChange={onInputChange}
          >
            <option value="">Select Carrier</option>
            {
              metadata.carriers?.map((carrier) => (
                <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
              ))
            }
          </Select>
        </Box>
        <form onSubmit={onManufacturerSubmit}>
          <Box w="90%" mb={4}>
            <Text fontWeight={600} mb={2}>New Manufacturer</Text>
            <Input
              placeholder="New Manufacturer"
              bg="blue.50"
              name="newManufacturer"
              value={parentDevice.newManufacturer}
              onChange={onInputChange}
            />
          </Box>
          <Container
            p={0}
            m={0}
            w="90%"
            variant="file"
            display="flex"
            alignItems="center"
          >
            <Input
              w={110}
              p={0}
              mr={4}
              type="file"
              name="file"
              onChange={handleFileUpload}
            />
            {
              selectedFile.fileName
              && (
                <Flex
                  alignItems="center"
                  bg="blue.50"
                  p={1}
                  borderRadius={4}
                  color="gray.200"
                  maxW="50%"
                >
                  <CloseIcon
                    cursor="pointer"
                    boxSize={2.5}
                    mr={2}
                    onClick={deleteSelectedFile}
                  />
                  <Text>{selectedFile.fileName}</Text>
                </Flex>
              )
            }
          </Container>
        </form>
      </Box>
    </Flex>
  )
}
