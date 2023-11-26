import { SearchIcon } from '@chakra-ui/icons'
import {
  Button,
  Container,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { NewTutorials } from '../modals/tutorials'

type Props = {
  filterContent: ({ type, value }: { type: string; value: string }) => void
  searchValue: string
}

export const HeaderContent = ({ filterContent, searchValue }: Props) => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Container
      p="0"
      m="0"
      display="flex"
      mb="4"
      justifyContent="space-between"
      maxW="none"
    >
      <Flex>
        <InputGroup>
          <InputLeftElement w="fit-content" pl={2.5}>
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Search"
            value={searchValue}
            onChange={({ target }) =>
              filterContent({ type: 'productName', value: target.value })}
          />
        </InputGroup>
      </Flex>
      <Flex>
        <Menu autoSelect={false}>
          {({ isOpen: isOpenMenu }) => (
            <>
              <MenuButton
                isActive={isOpenMenu}
                as={Button}
                w={126}
                h="12"
                px="2"
              >
                <Flex alignItems="center" justify="space-around">
                  <Image src="assets/images/add.svg" />
                  <Text fontSize="sm">Add New</Text>
                </Flex>
              </MenuButton>
              <MenuList
                h="116px"
                p="16px"
                minW="132px"
                bgColor="white"
                borderRadius="8px"
                borderWidth="0"
                display="flex"
                justifyContent="space-between"
                flexDir="column"
                boxShadow="0px 4px 30px rgba(45, 52, 54, 0.1)"
              >
                <MenuItem
                  as={Container}
                  variant="menuItem"
                  onClick={onOpen}
                >
                  <Image src="assets/images/tutorial-icon.svg" />
                  Tutorial
                </MenuItem>
                <MenuItem
                  as={Container}
                  variant="menuItem"
                  onClick={() => navigate('/faq/add')}
                >
                  <Image src="assets/images/faq-icon.svg" />
                  FAQ
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
      <NewTutorials isOpen={isOpen} onClose={onClose} />
    </Container>
  )
}
