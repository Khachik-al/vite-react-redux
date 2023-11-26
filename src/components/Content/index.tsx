import {
  Box, Container, Flex, Spinner, Td, Tr,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import type {
  ContentRes,
  ContentType,
  ResponseType,
  DeviceList,
} from '../../interfaces/data.interface'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getCategories, getDevices } from '../../redux/slices/products'
import { getCustomers } from '../../services/api'
import {
  cloneContentById,
  getContent,
} from '../../services/api/product.service'
import { PaginationComp } from '../Pagination'
import { ContentTableRow } from '../table/ContentTableRow'
import { Table } from '../table/Table'
import { FilterContent } from './filterContent'
import { HeaderContent } from './headerContent'

const devicesColumns = [
  {
    title: 'Title',
    isSortable: true,
    key: 'titleOrder',
  },
  {
    title: 'Device',
    isSortable: true,
    key: 'productOrder',
  },
  {
    title: 'Category',
    isSortable: true,
    key: 'categoryOrder',
  },
  {
    title: 'Article Type',
    isSortable: true,
    key: 'type',
  },
  {
    title: 'Status',
    isSortable: true,
    key: 'statusOrder',
  },
  {
    title: 'Action',
    isSortable: false,
    key: 'action',
  },
]

type FilteredData = {
  contentType?: ContentType
  productName?: string
  categoryName?: string
  status?: 'Approved' | 'Hidden'
}

export const MainContent = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState<ContentRes>()
  const [loading, setLoading] = useState('')
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [customers, setCustomers] = useState<DeviceList['customers']>()
  const [filteredData, setFilteredData] = useState<FilteredData>({})
  const [sort, setSort] = useState<{ sortKey: string; order: 'ASC' | 'DESC' }>({
    sortKey: 'productOrder',
    order: 'ASC',
  })
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const dispatch = useAppDispatch()
  const {
    products: { devices, categories },
    auth: { token },
  } = useAppSelector((state) => state)

  const getAllContent = async () => {
    setIsLoadingContent(true)
    try {
      const res = (await getContent({
        token,
        filteredData,
        order: sort,
        page,
        pageSize,
      })()) as ResponseType<ContentRes>
      const { data } = await res.json()
      setContent(data)
      const newPage = Math.ceil(data.count / pageSize)
      if (page > newPage) setPage(newPage)
      setIsLoadingContent(false)
    } catch (error) {
      console.error(error)
    }
  }

  const getAllCustomers = async () => {
    const res = (await getCustomers({ token })()) as ResponseType<
    DeviceList['customers']
    >
    const { data } = await res.json()
    setCustomers(data)
  }

  const filterContent = ({ type, value }: { type: string; value: string }) => {
    setFilteredData((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const onRawClick = (id: string, type: 'faq' | 'tutorial') => {
    if (type === 'faq') {
      navigate(`/faq/${id}`)
    }
    if (type === 'tutorial') {
      navigate(`/content/${type}/?id=${id}`)
    }
  }

  const cloneContent = async ({
    id,
    type,
  }: {
    id: string
    type: 'faq' | 'tutorial'
  }) => {
    try {
      setLoading(id)
      const res = (await cloneContentById({
        id,
        token,
        type,
      })()) as ResponseType
      const { message } = await res.json()
      showSuccessMessage(message)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
        showErrorMessage(error.message)
      }
    }
    setLoading('')
  }

  const handlePageChange = (number: number) => {
    setPage(number)
  }

  const handlePageSizeChange = (number: number) => {
    setPageSize(number)
  }

  useEffect(() => {
    getAllContent()
  }, [filteredData, page, pageSize, sort])

  useEffect(() => {
    if (filteredData.contentType) {
      dispatch(getCategories({ type: filteredData.contentType }))
    }
  }, [filteredData.contentType])

  useEffect(() => {
    getAllContent()
    getAllCustomers()
    dispatch(getDevices())
    dispatch(getCategories({ type: 'faq' }))
  }, [])

  return (
    <Container variant="contentWrapper">
      <HeaderContent
        searchValue={filteredData.productName ?? ''}
        filterContent={filterContent}
      />
      <FilterContent
        devices={devices.deviceList}
        categories={categories}
        filterContent={filterContent}
        customers={customers}
      />
      <Box minH="xl">
        {isLoadingContent ? (
          <Spinner />
        ) : (
          <Table columns={devicesColumns} sort={sort} setSort={setSort}>
            {!content?.count ? (
              <Tr>
                <Td>No Data Available</Td>
              </Tr>
            ) : (
              <>
                {content.content.map((c) => (
                  <ContentTableRow
                    key={c.id}
                    content={c}
                    loading={loading}
                    cloneContent={cloneContent}
                    onClick={onRawClick}
                  />
                ))}
              </>
            )}
          </Table>
        )}
      </Box>
      {content && (
        <Flex mt={12} justifyContent="end" alignItems="center">
          <PaginationComp
            pageSize={pageSize}
            changePage={handlePageChange}
            current={page}
            total={content.count}
            changePageSize={handlePageSizeChange}
          />
        </Flex>
      )}
    </Container>
  )
}
