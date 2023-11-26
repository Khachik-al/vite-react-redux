import {
  Box,
  Button, Flex, HStack, Input,
  Modal, ModalBody,
  ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Select, Text,
} from '@chakra-ui/react'
import {
  ChangeEvent, FormEvent, useRef, useState,
} from 'react'
import { SingleProduct } from '../../interfaces/data.interface'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { useNotifications } from '../../hooks/useNotifications'
import { editCloneDevice, getSingleDevice } from '../../redux/slices/products'
import { postNewCarrier } from '../../redux/slices/metadata'

type Props = {
  isOpen: boolean
  onClose: () => void
  device: SingleProduct
}

export const EditCloneDeviceModal = ({ isOpen, onClose, device }: Props) => {
  const { metadata } = useAppSelector((state) => state.metadata)
  const dispatch = useAppDispatch()
  const { showSuccessMessage, showErrorMessage } = useNotifications()
  const ref = useRef<null | HTMLInputElement>(null)
  const [form, setForm] = useState({
    id: device.id,
    referenceId: device.reference_id,
    customers: device.customers.map((c) => ({
      id: c.customer.id,
      slug: c.slug,
    })),
    carrierId: device.carrier.id,
    languageId: device.language.id,
    vanityName: device.vanity_name,
  })
  const [newCarrier, setNewCarrier] = useState('')

  const changeNewCarrier = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCarrier(e.target.value)
  }

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleCarrierSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const resultAction = await dispatch(postNewCarrier(newCarrier))
    if (postNewCarrier.fulfilled.match(resultAction)) {
      showSuccessMessage('Successfully added carrier')
    }
    if (postNewCarrier.rejected.match(resultAction)) {
      showErrorMessage('Error while adding carrier')
    }
    setNewCarrier('')
    ref?.current?.blur()
  }

  const submitForm = async () => {
    const reqBody: any = { ...form }
    delete reqBody.id
    const resultAction = await dispatch(editCloneDevice({ form: reqBody, id: device.id }))
    if (editCloneDevice.fulfilled.match(resultAction)) {
      showSuccessMessage('Successfully changed the device')
      dispatch(getSingleDevice(device.id))
    }
    if (editCloneDevice.rejected.match(resultAction)) {
      showErrorMessage('Could not change device')
    }
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent w="fit-content" maxW="none">
        <ModalHeader>Edit Clone Device</ModalHeader>
        <ModalBody>
          <HStack gap={10} alignItems="baseline">
            <Flex gap={3} direction="column">
              <Box>
                <Text>Product Name</Text>
                <Input
                  disabled
                  value={device.product.name}
                />
              </Box>
              <Box>
                <Text>Product Type</Text>
                <Input
                  disabled
                  value={device.reference_type}
                />
              </Box>
              <Box>
                <Text>Customer ID</Text>
                <Input
                  placeholder="Customer ID"
                  name="referenceId"
                  value={form.referenceId}
                  onChange={handleFormChange}
                />
              </Box>
              <Box>
                <Text>Carrier</Text>
                <Select
                  name="carrierId"
                  value={form.carrierId}
                  onChange={handleFormChange}
                >
                  {metadata.carriers?.map((carrier) => (
                    <option key={carrier.id} value={carrier.id}>
                      {carrier.name}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
            <Flex gap={3} direction="column">
              <Box>
                <form onSubmit={handleCarrierSubmit}>
                  <Text>New Carrier</Text>
                  <Input
                    ref={ref}
                    bg="blue.50"
                    placeholder="New Carrier"
                    name="newCarrier"
                    value={newCarrier}
                    onChange={changeNewCarrier}
                  />
                </form>
              </Box>
              <Box>
                <Text>Vanity Name</Text>
                <Input
                  placeholder="Vanity Name"
                  name="vanityName"
                  value={form.vanityName}
                  onChange={handleFormChange}
                />
              </Box>
              <Box>
                <Text>Manufacturer</Text>
                <Select
                  disabled
                  bg="blue.50"
                  value={device.product.manufacturer.id}
                >
                  <option value={device.product.manufacturer.id}>
                    {device.product.manufacturer.name}
                  </option>
                </Select>
              </Box>
              <Box>
                <Text>Language</Text>
                <Select
                  name="languageId"
                  value={form.languageId}
                  onChange={handleFormChange}
                >
                  {metadata.languages.map((language) => (
                    <option key={language.id} value={language.id}>
                      {language.name}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Flex gap={4}>
            <Button
              px={8}
              py={4}
              variant="secondary_button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              px={8}
              py={4}
              onClick={submitForm}
            >
              Save
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
