import { Box } from '@chakra-ui/react'
import { Customer } from '../../interfaces/tutorials.interface'

type Props = {
  customer: Customer
  isSelected: boolean
  setCurrentCustomers: (p: Customer[]) => void
  currentCustomers: Customer[]
}

export const CustomerSelectElement = ({
  customer,
  isSelected,
  setCurrentCustomers,
  currentCustomers,
}: Props) => {
  const handleSelect = () => {
    if (isSelected) {
      const filtered = currentCustomers.filter(
        (currentCustomer) => (
          currentCustomer.id !== customer.id
        ),
      )
      setCurrentCustomers([...filtered])
    } else {
      setCurrentCustomers([...currentCustomers, customer])
    }
  }

  return (
    <Box
      key={customer.id}
      borderRadius={8}
      bg={!isSelected ? 'gray.50' : 'blue.500'}
      cursor="pointer"
      color={!isSelected ? 'gray.200' : 'main_white'}
      p={2}
      onClick={handleSelect}
    >
      {customer.name}
    </Box>
  )
}
