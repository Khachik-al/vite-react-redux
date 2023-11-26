import {
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Select,
  Text,
} from '@chakra-ui/react'
import {
  ChangeEvent, SyntheticEvent, useEffect, useState,
} from 'react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { generateSlug } from '../../utils/generateSlug'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { Metadata, Customer } from '../../interfaces/metadata.interface'
import { useNotifications } from '../../hooks/useNotifications'
import { getCustomersList, postNewCarrier } from '../../redux/slices/metadata'
import { CloneDevice } from '../../interfaces/data.interface'

type CloneDeviceForm = {
  languageId: string
  carrierId: string
  customers: {
    id: string
    slug: string
  }[]
  vanityName: string
  referenceId: string
}

type Props = {
  cloneDevices: CloneDevice[]
  setCloneDevices: (p: CloneDevice[]) => void
}

export const AddCloneDevicePanel = ({ cloneDevices, setCloneDevices }: Props) => {
  const dispatch = useAppDispatch()
  const { showSuccessMessage, showErrorMessage } = useNotifications()
  const [customers, setCustomers] = useState<Customer[]>([])
  const { metadata }: { metadata: Metadata } = useAppSelector((state) => state.metadata)
  const [newCarrier, setNewCarrier] = useState('')
  const [cloneDeviceForm, setCloneDeviceForm] = useState<CloneDeviceForm>({
    languageId: '',
    carrierId: '',
    customers: [],
    vanityName: '',
    referenceId: '',
  })
  const [slug, setSlug] = useState('')

  const onSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug(generateSlug(e.target.value))
  }

  const onInputChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setCloneDeviceForm({
      ...cloneDeviceForm,
      [e.target?.name]: e.target.value,
    })
  }

  const handleCarrierChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCarrier(e.target.value)
  }

  const onCustomerClick = (value: string) => {
    if (cloneDeviceForm.customers.find((c) => c.id === value)) {
      setCloneDeviceForm({
        ...cloneDeviceForm,
        customers: [...cloneDeviceForm.customers.filter((c) => c.id !== value)],
      })
      return
    }
    setCloneDeviceForm({
      ...cloneDeviceForm,
      customers: [...cloneDeviceForm.customers, { id: value, slug: '' }],
    })
  }

  const addNewCarrier = (e: SyntheticEvent) => {
    e.preventDefault()
    dispatch(postNewCarrier(newCarrier))
      .then(() => showSuccessMessage('Carrier successfully added'))
      .catch(() => showErrorMessage('Failed to add carrier'))
      .finally(() => setNewCarrier(''))
  }

  const onSubmit = () => {
    if (cloneDevices.find(
      (c) => c.referenceId === cloneDeviceForm.referenceId,
    )
    ) {
      showErrorMessage('Reference with same ID exists')
      return
    }
    if (cloneDeviceForm.customers.length === 0 || !slug) return
    const deviceClone = {
      ...cloneDeviceForm,
      customers: [...cloneDeviceForm.customers].map((c) => ({
        id: c.id,
        slug,
      })),
    }
    setCloneDevices([...cloneDevices, deviceClone])
    setSlug('')
    setCloneDeviceForm({
      languageId: '',
      carrierId: '',
      customers: [],
      vanityName: '',
      referenceId: '',
    })
  }

  const fetchCustomers = async () => {
    const resultAction = await dispatch(
      getCustomersList(cloneDeviceForm.referenceId.substring(0, 2)),
    )
    if (getCustomersList.fulfilled.match(resultAction)) {
      const data = resultAction.payload
      setCustomers(data)
    }
  }

  useEffect(() => {
    if (cloneDeviceForm.referenceId.length < 2) return
    fetchCustomers()
  }, [cloneDeviceForm.referenceId])

  return (
    <>
      <Flex justifyContent="space-between">
        <Box w="50%">
          <Box w="90%" mb={4}>
            <Text fontWeight={600} mb={2}>Carrier</Text>
            <Select
              name="carrierId"
              value={cloneDeviceForm.carrierId}
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
          <Box w="90%" mb={4}>
            <form onSubmit={addNewCarrier}>
              <Text fontWeight={600} mb={2}>New Carrier</Text>
              <Input
                placeholder="New Carrier Name"
                name="newCarrier"
                bg="blue.50"
                value={newCarrier}
                onChange={handleCarrierChange}
              />
            </form>
          </Box>
          <Box w="90%" mb={4}>
            <Text fontWeight={600} mb={2}>Customer ID</Text>
            <Input
              placeholder="Enter Customer ID"
              name="referenceId"
              value={cloneDeviceForm.referenceId}
              onChange={onInputChange}
            />
          </Box>
          <Box w="90%" mb={4}>
            <Text fontWeight={600} mb={2}>Slug</Text>
            <Input
              placeholder="Enter Slug"
              name="slug"
              value={slug}
              onChange={onSlugChange}
            />
          </Box>
        </Box>
        <Box w="50%">
          <Box w="90%" mb={4}>
            <Text fontWeight={600} mb={2}>Vanity Name</Text>
            <Input
              placeholder="Vanity Name"
              name="vanityName"
              value={cloneDeviceForm.vanityName}
              onChange={onInputChange}
            />
          </Box>
          <Box w="90%" mb={4}>
            <Text fontWeight={600} mb={2}>Language</Text>
            <Select
              name="languageId"
              value={cloneDeviceForm.languageId}
              onChange={onInputChange}
            >
              <option value="">Select Language</option>
              {
              metadata.languages.map((language) => (
                <option key={language.id} value={language.id}>{language.name}</option>
              ))
            }
            </Select>
          </Box>
          <Box w="90%" mb={4}>
            <Flex fontWeight={600} mb={2}>
              Customer
              <Text
                ml={1}
                color={
                cloneDeviceForm.customers.length
                  ? 'blue.500'
                  : 'red'
              }
              >
                *
              </Text>
            </Flex>
            <Menu variant="multiselect" closeOnSelect={false}>
              <MenuButton>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>Select Customer</Text>
                  <ChevronDownIcon boxSize={5} color="main_black" />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuOptionGroup
                  type="checkbox"
                  value={cloneDeviceForm.customers.map((c) => c.id)}
                >
                  {
                  !customers.length ? (
                    <MenuItemOption value="">
                      No Data
                    </MenuItemOption>
                  ) : customers.map((customer) => (
                    <MenuItemOption
                      key={customer.id}
                      value={customer.id}
                      onClick={() => onCustomerClick(customer.id)}
                    >
                      {customer.name}
                    </MenuItemOption>
                  ))
                }
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Flex>
      <Flex w="90%" justifyContent="end">
        <Button
          px={8}
          py={4}
          onClick={onSubmit}
        >
          Add Clone
        </Button>
      </Flex>
    </>
  )
}
