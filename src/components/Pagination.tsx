import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {
  Container, Circle, Menu, MenuButton, Button, MenuList, MenuItem, Box,
} from '@chakra-ui/react'
import Pagination from 'rc-pagination'
import { FC } from 'react'
import 'rc-pagination/assets/index.css'

type Props = {
  total: number
  current: number
  pageSize: number
  changePage: (value: number) => Promise<void> | void
  changePageSize: (value: number) => void
}

const renderImage = () => (
  <Circle size={1.5} bg="gray.100" />
)

const renderLeftArrow = () => (
  <ChevronLeftIcon />
)

const renderRightArrow = () => (
  <ChevronRightIcon />
)

export const PaginationComp: FC<Props> = ({
  changePage, current, total, pageSize, changePageSize,
}) => {
  const availablePageSizes = [10, 15, 20]

  return (
    <Container variant="pagination" mb={8}>
      <Pagination
        showTitle={false}
        pageSize={pageSize}
        onChange={changePage}
        current={current}
        total={total}
        className={total > 50 ? 'more_than_50' : ''}
        jumpPrevIcon={renderImage}
        jumpNextIcon={renderImage}
        prevIcon={renderLeftArrow}
        nextIcon={renderRightArrow}
      />
      <Box ml={2} h="full">
        {total > 10 && (
          <Menu>
            <MenuButton
              as={Button}
              h="full"
              bg="gray.50"
              borderRadius={0}
              fontSize={12}
              color="gray.200"
              p={2}
              rightIcon={<ChevronDownIcon />}
              _hover={{ bg: 'gray.50' }}
            >
              {pageSize}
            </MenuButton>
            <MenuList minW={0} borderColor="transparent">
              {
                availablePageSizes.map((value) => (
                  <MenuItem
                    key={value}
                    _focus={{ bg: 'gray.50' }}
                    _hover={{ bg: 'gray.50' }}
                    color="gray.200"
                    px={4}
                    onClick={() => changePageSize(value)}
                  >
                    {value}
                  </MenuItem>
                ))
              }
            </MenuList>
          </Menu>
        )}
      </Box>
    </Container>
  )
}
