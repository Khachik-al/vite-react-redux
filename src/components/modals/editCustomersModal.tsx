import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Box, Input,
} from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { generateSlug } from '../../utils/generateSlug'
import { CustomerSelectElement } from './customerSelectElement'
import { useNotifications } from '../../hooks/useNotifications'
import { useAppDispatch } from '../../redux/hooks'
import type { SingleProduct } from '../../interfaces/data.interface'
import { editDeviceCustomers, getCustomersList } from '../../redux/slices/metadata'
import { editReferenceCustomers, getSingleDevice } from '../../redux/slices/products'

type Props = {
  isOpen: boolean
  onClose: () => void
  device: SingleProduct
  type: string
}

type Customer = {
  id: string
  name: string
  shortname: string
}

export const EditCustomersModal = ({
  isOpen, onClose, device, type,
}: Props) => {
  const { showSuccessMessage, showErrorMessage } = useNotifications()
  const [allCustomers, setAllCustomers] = useState<Customer[]>(
    type === 'clone'
      ? device.product.customers
      : [],
  )
  const [currentCustomers, setCurrentCustomers] = useState<Customer[]>(
    type === 'clone'
      ? device.customers?.map((d) => d.customer)
      : [],
  )
  const [slug, setSlug] = useState('')
  const dispatch = useAppDispatch()

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug(generateSlug(e.target.value))
  }

  const selectAll = () => {
    setCurrentCustomers([...allCustomers])
  }

  const deselectAll = () => {
    setCurrentCustomers([])
  }

  const handleParentSave = async () => {
    const resultAction = await dispatch(
      editDeviceCustomers({
        id: device.product.id,
        customerIds: currentCustomers.map((c) => c.id),
      }),
    )
    if (editDeviceCustomers.fulfilled.match(resultAction)) {
      const res = resultAction.payload
      if (res.error) {
        showErrorMessage(res.message)
        return
      }
      showSuccessMessage('Successfully changed.')
    }
  }

  const handleReferenceSave = async () => {
    const reqBody: { id: string, slug: string }[] = []
    currentCustomers.forEach((cc) => {
      const currentCustomer = device.customers.find((c) => c.customer.id === cc.id)
      if (currentCustomer) {
        reqBody.push({
          id: currentCustomer.customer.id,
          slug: currentCustomer.slug,
        })
      } else {
        if (!slug) {
          showErrorMessage('Please enter slug')
          return
        }
        reqBody.push({
          id: cc.id,
          slug,
        })
      }
    })
    if (!reqBody.length) {
      showErrorMessage('Please choose at least one customer')
      return
    }
    const resultAction = await dispatch(
      editReferenceCustomers({
        id: device.id,
        customers: reqBody,
      }),
    )
    if (editReferenceCustomers.fulfilled.match(resultAction)) {
      const { message, error } = resultAction.payload
      if (error) {
        showErrorMessage(message)
        return
      }
      showSuccessMessage('Successfully changed.')
    }
  }

  const handleSave = async () => {
    if (type === 'parent') {
      await handleParentSave()
    } else {
      await handleReferenceSave()
    }
    await dispatch(getSingleDevice(device.id))
    onClose()
  }

  const fetchCustomers = async () => {
    const resultAction = await dispatch(getCustomersList(''))
    if (getCustomersList.fulfilled.match(resultAction)) {
      const data = resultAction.payload
      setAllCustomers(data)
    }
  }

  useEffect(() => {
    if (type === 'clone') return
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (type === 'clone') return
    const deviceCustomers = allCustomers.filter(
      (customer) => device.product.customers.find((c) => c.id === customer.id),
    )
    setCurrentCustomers(deviceCustomers)
  }, [allCustomers])

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent maxW="none" w={500} p={8}>
        <ModalHeader p={0}>
          <Text fontSize={18} fontWeight={600}>
            {`${device.product.manufacturer.name} ${device.product.name} `}
            -
            Customers
          </Text>
        </ModalHeader>
        <ModalBody mt={6} p={0}>
          <Flex justifyContent="end">
            <Flex gap={4}>
              <Button
                py={2}
                px={8}
                variant="secondary_button"
                onClick={selectAll}
              >
                Select All
              </Button>
              <Button
                variant="secondary_button"
                borderColor="gray.200"
                color="gray.200"
                py={2}
                px={8}
                onClick={deselectAll}
                _hover={{
                  borderColor: 'gray.100',
                  color: 'gray.100',
                }}
              >
                Deselect All
              </Button>
            </Flex>
          </Flex>
          <Flex wrap="wrap" gap={1} py={8} maxH={300} overflowY="auto">
            {!allCustomers.length ? (
              <Box>No allCustomers available</Box>
            ) : (
              <>
                {allCustomers.map((customer) => {
                  const isSelected = currentCustomers.find(
                    (currentCustomer) => currentCustomer.id === customer.id,
                  )

                  return (
                    <CustomerSelectElement
                      key={customer.id}
                      customer={customer}
                      isSelected={!!isSelected}
                      setCurrentCustomers={setCurrentCustomers}
                      currentCustomers={currentCustomers}
                    />
                  )
                })}
              </>
            )}
          </Flex>
          {
            type === 'clone' && (
            <Box>
              <Text mb={1} fontWeight={600}>
                Enter Slug
                {' '}
                {!slug && '*'}
              </Text>
              <Input
                placeholder="Enter slug"
                value={slug}
                onChange={handleSlugChange}
              />
            </Box>
            )
          }
        </ModalBody>
        <ModalFooter px={0}>
          <Flex gap={4}>
            <Button variant="secondary_button" py={4} px={8} onClick={onClose}>
              Cancel
            </Button>
            <Button py={4} px={8} onClick={handleSave}>
              Save
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
