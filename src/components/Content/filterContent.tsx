import {
  Container, Flex, Heading, Select,
} from '@chakra-ui/react'
import type { FC } from 'react'
import type { Categories, DeviceList, Product } from '../../interfaces/data.interface'
import { LocalLoader } from '../localLoader'

type Props = {
  devices: Product['deviceList'][]
  categories: Categories[]
  customers: DeviceList['customers']
  filterContent: ({ type, value }: { type: string, value: string }) => void
}

export const FilterContent: FC<Props> = ({
  devices,
  categories,
  customers,
  filterContent,
}) => (
  <Container p="0" m="0" display="flex" maxW="none" gap="3" mb="5">
    <Flex direction="column" width="full">
      <Heading as="h3" fontSize="sm" mb={2}>
        Select Article Type
      </Heading>
      <Select
        placeholder="FAQ or Tutorial"
        onChange={({ target }) =>
          filterContent({ type: 'contentType', value: target.value })}
      >
        <option value="faq">FAQ</option>
        <option value="tutorial">Tutorial</option>
      </Select>
    </Flex>
    <Flex direction="column" width="full">
      <Heading as="h3" fontSize="sm" mb={2}>
        Select Device
      </Heading>
      {devices ? (
        <Select
          placeholder="All Devices"
          onChange={({ target }) =>
            filterContent({ type: 'productName', value: target.value })}
        >
          {devices.map((item) => (
            <option key={item.id} value={item.product.name}>
              {item.product.name}
            </option>
          ))}
        </Select>
      ) : (
        <LocalLoader />
      )}
    </Flex>
    <Flex direction="column" width="full">
      <Heading as="h3" fontSize="sm" mb={2}>
        Select Category
      </Heading>
      {categories ? (
        <Select
          placeholder="Categories"
          onChange={({ target }) =>
            filterContent({ type: 'categoryName', value: target.value })}
        >
          {categories.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
      ) : (
        <LocalLoader />
      )}
    </Flex>
    <Flex direction="column" width="full">
      <Heading as="h3" fontSize="sm" mb={2}>
        Select Customers
      </Heading>
      {customers ? (
        <Select placeholder="Customers">
          {customers.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
      ) : <LocalLoader />}
    </Flex>
    <Flex direction="column" width="full">
      <Heading as="h3" fontSize="sm" mb={2}>
        Status
      </Heading>
      <Select
        placeholder="All Statuses"
        onChange={({ target }) =>
          filterContent({ type: 'status', value: target.value })}
      >
        <option value="true">Approved</option>
        <option value="false">Hidden</option>
      </Select>
    </Flex>
  </Container>
)
