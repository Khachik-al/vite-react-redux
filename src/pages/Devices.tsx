import { ChangeEvent, useEffect, useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  Flex,
  Text,
  Input,
  Button,
  useDisclosure, Td, Tr, Spinner, Select, Box,
} from '@chakra-ui/react'
import { SortType, Table } from '../components/table/Table'
import { PaginationComp } from '../components/Pagination'
import { AddDeviceModal } from '../components/modals/AddDeviceModal'
import { DeviceInformationModal } from '../components/modals/DeviceInformationModal'
import { DeviceTableRow } from '../components/table/DeviceTableRow'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  getDevices,
  getSingleDevice,
  resetSelectedDevice,
} from '../redux/slices/products'
import type { Product } from '../interfaces/data.interface'
import { getMetadata } from '../redux/slices/metadata'
import { returnFilterObject } from '../utils/helper'

const devicesColumns = [
  {
    title: 'Customer Id',
    isSortable: true,
    key: 'customerId',
  },
  {
    title: 'Manufacturer',
    isSortable: true,
    key: 'manufacturer',
  },
  {
    title: 'Product Name',
    isSortable: true,
    key: 'deviceModel',
  },
  {
    title: 'Type',
    isSortable: true,
    key: 'type',
  },
  {
    title: 'Vanity Name',
    isSortable: true,
    key: 'vanityName',
  },
  {
    title: 'Manual Location',
    isSortable: false,
    key: 'manualLocation',
  },
  {
    title: 'Booklet Location',
    isSortable: false,
    key: 'bookletLocation',
  },
  {
    title: 'Image Location',
    isSortable: false,
    key: 'imageLocation',
  },
]

export const Devices = () => {
  const {
    isOpen: infoModalOpen,
    onOpen: onInfoModalOpen,
    onClose: onInfoModalClose,
  } = useDisclosure()
  const {
    isOpen: addModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure()
  const [sort, setSort] = useState<SortType>(({ sortKey: 'customerId', order: 'ASC' }))
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const dispatch = useAppDispatch()
  const { deviceList: devices, count } = useAppSelector((state) => state.products.devices)
  const { device, loading } = useAppSelector((state) => state.products.currentDevice)
  const [filters, setFilters] = useState({
    customerId: '',
    manufacturerName: '',
    productType: '',
    manualLocation: '',
    defaultImageLocation: '',
    bookletLocation: '',
  })

  const closeDeviceModal = () => {
    dispatch(resetSelectedDevice())
    setSelectedDeviceId('')
    onInfoModalClose()
  }

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    if (currentPage * pageSize > count) {
      if (Math.round(count / pageSize) === 0) return
      setCurrentPage(Math.round(count / pageSize))
    }
  }, [count])

  useEffect(() => {
    dispatch(getMetadata())
  }, [])

  useEffect(() => {
    dispatch(getDevices(
      {
        size: `${pageSize}`,
        page: `${currentPage}`,
        ...returnFilterObject(filters),
      },
    ))
  }, [pageSize, currentPage, filters, device])

  const selectDevice = (product: Product['deviceList']) => {
    setSelectedDeviceId(product.id)
    onInfoModalOpen()
  }

  useEffect(() => {
    if (!selectedDeviceId) return
    dispatch(getSingleDevice(selectedDeviceId))
  }, [selectedDeviceId])

  if (loading) {
    return (
      <Flex h="full" justifyContent="center" alignItems="center">
        <Spinner thickness="7px" speed="0.85s" color="blue.500" size="xl" />
      </Flex>
    )
  }

  return (
    <>
      <AddDeviceModal
        isOpen={addModalOpen}
        onClose={onAddModalClose}
        pageSize={pageSize}
        currentPage={currentPage}
        device={null}
      />
      {
        device
        && (
        <DeviceInformationModal
          onClose={closeDeviceModal}
          isOpen={infoModalOpen}
          pageSize={pageSize}
          currentPage={currentPage}
          key={device.id}
        />
        )
      }
      <Text mb={8} lineHeight={8} fontSize={24} color="gray.200">
        Devices
      </Text>
      <Flex mb={4}>
        <Button
          px={4}
          py={3}
          fontSize={14}
          fontWeight={400}
          onClick={onAddModalOpen}
        >
          <AddIcon boxSize={4} color="main_white" mr={2} />
          Add Device
        </Button>
      </Flex>
      <Flex py={3}>
        <Flex justifyContent="space-between" overflowX="auto" gap={4} pb={2}>
          <Box minW={180}>
            <Text mb={1} fontWeight={600}>Customer ID</Text>
            <Input
              w="full"
              placeholder="Customer ID"
              name="customerId"
              onChange={handleFilterChange}
              value={filters.customerId}
            />
          </Box>
          <Box minW={180}>
            <Text mb={1} fontWeight={600}>Manufacturer</Text>
            <Input
              w="full"
              placeholder="Manufacturer name"
              name="manufacturerName"
              onChange={handleFilterChange}
              value={filters.manufacturerName}
            />
          </Box>
          <Box minW={180}>
            <Text mb={1} fontWeight={600}>Type</Text>
            <Select
              w="full"
              placeholder="Product Type"
              name="productType"
              onChange={handleFilterChange}
              value={filters.productType}
            >
              <option value="parent">Parent</option>
              <option value="clone">Clone</option>
            </Select>
          </Box>
          <Box minW={180}>
            <Text mb={1} fontWeight={600}>Manual</Text>
            <Select
              w="full"
              placeholder="Manual Location"
              name="manualLocation"
              onChange={handleFilterChange}
              value={filters.manualLocation}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Box>
          <Box minW={180}>
            <Text mb={1} fontWeight={600}>Booklet</Text>
            <Select
              w="full"
              placeholder="Booklet Location"
              name="bookletLocation"
              onChange={handleFilterChange}
              value={filters.bookletLocation}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Box>
          <Box minW={180}>
            <Text mb={1} fontWeight={600}>Image</Text>
            <Select
              w="full"
              placeholder="Image Location"
              name="defaultImageLocation"
              onChange={handleFilterChange}
              value={filters.defaultImageLocation}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Box>
        </Flex>
      </Flex>
      <Table
        columns={devicesColumns}
        sort={sort}
        setSort={setSort}
      >
        {
          !devices
            ? (
              <Tr>
                <Td>No Data Available</Td>
              </Tr>
            )
            : (
              <>
                {
                  devices.map((d) => (
                    <DeviceTableRow
                      key={d.id}
                      device={d}
                      selectDevice={selectDevice}
                    />
                  ))
                }
              </>
            )
        }
      </Table>
      <Flex mt={12} justifyContent="end" alignItems="center">
        <PaginationComp
          pageSize={pageSize}
          changePage={setCurrentPage}
          current={currentPage}
          total={count}
          changePageSize={setPageSize}
        />
      </Flex>
    </>
  )
}
