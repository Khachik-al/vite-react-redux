import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  TableContainer,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Flex,
  Box,
} from '@chakra-ui/react'

const orderEnum = {
  DESC: <TriangleDownIcon w={3} h={2} />,
  ASC: <TriangleUpIcon w={3} h={2} />,
}

type TableProps = {
  columns: {
    title: string
    isSortable: boolean
    key: string
    renderItem?: (arg: any) => JSX.Element
  }[]
  sort: SortType
  setSort: React.Dispatch<React.SetStateAction<SortType>>
  children: JSX.Element
}

export type SortType = {
  sortKey: string
  order: 'ASC' | 'DESC'
}

export const Table = ({
  columns, sort, setSort, children,
}: TableProps) => {
  const toggleSorting = (key: string, isSortable: boolean) => {
    if (!key || !isSortable) return
    if (key === sort.sortKey) {
      setSort((prevState: SortType) => ({
        sortKey: key,
        order: prevState.order === 'ASC' ? 'DESC' : 'ASC',
      }))
    } else {
      setSort({
        sortKey: key,
        order: 'ASC',
      })
    }
  }
  return (
    <TableContainer maxW="100%" h="100%">
      <ChakraTable variant="basic">
        <Thead bg="blue.50" p={4} borderRadius={8}>
          <Tr>
            {columns.map((column) => (
              <Th
                key={column.title}
                lineHeight={6}
                fontWeight={600}
                textTransform="none"
                fontSize={14}
                width={10}
                color="gray.200"
                border="none"
                cursor={column.isSortable ? 'pointer' : 'default'}
                onClick={() => toggleSorting(column.key, column.isSortable)}
              >
                <Flex
                  alignItems="center"
                  position="relative"
                  userSelect="none"
                  pr={4}
                >
                  {column.title}
                  {sort.sortKey === column.key ? (
                    <Box position="absolute" right={0}>
                      {orderEnum[sort.order]}
                    </Box>
                  ) : null}
                </Flex>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>{children}</Tbody>
      </ChakraTable>
    </TableContainer>
  )
}
