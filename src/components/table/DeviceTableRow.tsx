import {
  Circle, Flex, Td, Tr,
} from '@chakra-ui/react'
import type { Product } from '../../interfaces/data.interface'

type Props = {
  device: Product['deviceList']
  selectDevice: (d: Product['deviceList']) => void
}

const renderImage = (it: string) => (
  <Flex w="50%" justifyContent="center">
    <Circle size={4} bg={it ? 'blue.500' : 'gray.50'} />
  </Flex>
)

export const DeviceTableRow = ({ device, selectDevice }: Props) => (
  <Tr
    cursor="pointer"
    _hover={{ bg: 'blue.50' }}
    onClick={() => selectDevice(device)}
  >
    <Td>
      {device.reference_id}
    </Td>
    <Td>
      {device.product.manufacturer.name}
    </Td>
    <Td>
      {device.product.name}
    </Td>
    <Td>
      {device.reference_type}
    </Td>
    <Td>
      {device.vanity_name}
    </Td>
    <Td>
      {renderImage(device.documents?.manual || '')}
    </Td>
    <Td>
      {renderImage(device.documents?.booklet || '')}
    </Td>
    <Td>
      {renderImage(device.documents?.main_image || '')}
    </Td>
  </Tr>
)
