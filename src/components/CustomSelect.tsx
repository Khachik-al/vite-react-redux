import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  ListItem,
  Text,
  UnorderedList,
  useOutsideClick,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { Customer } from '../interfaces/tutorials.interface'
import { RequiredMark } from './RequiredMark'

type Props = {
  headingText: string
  isRequired: { isRequiredChild: boolean; isNotification: boolean }
  text: string
  list: Customer[]
  changeList: (prev: Customer[]) => void
  zIndex: number
  onBlur: () => void
}

type List = {
  checked?: boolean
  id: string
  name: string
}

export const CustomSelect = ({
  headingText,
  isRequired,
  text,
  list,
  changeList,
  zIndex,
  onBlur,
}: Props) => {
  const [selectList, setSelectList] = useState(false)
  const ref = useRef(null)

  useOutsideClick({
    ref,
    handler: () => (selectList ? setSelectList(false) : ''),
  })

  const checkedItem = (id: string) => {
    const newList = list.map((item: Customer) => {
      if (id === item.id) {
        return { ...item, checked: !item.checked }
      }
      return item
    })
    changeList(newList)
  }

  const handleClickSelect = () => {
    setSelectList(!selectList)
  }

  return (
    <Box width="full" onBlur={onBlur}>
      <Heading as="h3" variant="title">
        {headingText}
        {isRequired && isRequired.isRequiredChild && (
          <RequiredMark isRemind={isRequired.isNotification} />
        )}
      </Heading>
      <Container
        ref={ref}
        zIndex={zIndex}
        w="full"
        borderBottomRadius={selectList ? '0' : 'md'}
        variant="select"
      >
        <Button variant="select" onClick={handleClickSelect}>
          <Text>{text}</Text>
          <Image
            transform="rotate(180deg)"
            boxSize={4}
            src="/assets/images/arrow-down.png"
          />
        </Button>
        <UnorderedList
          ml={0}
          borderTop="1px solid"
          overflowX="hidden"
          position="absolute"
          bg="white"
          top={14}
          border="1px solid"
          borderBottomRadius="md"
          w="full"
          maxH={36}
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': {
              width: 4,
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-track': {
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: 4,
            },
          }}
          display={selectList ? '' : 'none'}
        >
          {list?.map((item: List) => (
            <ListItem
              borderRadius={4}
              m={1}
              key={item.id}
              bgColor={item.checked ? 'blue.50' : ''}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Checkbox
                justifyContent="flex-end"
                w="100%"
                variant="select"
                p={2}
                colorScheme="transparent"
                border="none"
                iconColor="black"
                isChecked={item.checked}
                _checked={{ borderColor: 'transparent' }}
                sx={{
                  span: {
                    mr: 2,
                    ml: 0,
                    _focusVisible: { boxShadow: 'none' },
                  },
                }}
                flexDir="row-reverse"
                onChange={() => checkedItem(item.id)}
              >
                {item.name}
              </Checkbox>
            </ListItem>
          ))}
        </UnorderedList>
      </Container>
      <Flex mt={2} minH={10} mr={0} maxW="2xl" flexWrap="wrap">
        {list?.map(
          (item: List) =>
            item.checked && (
              <Flex
                align="center"
                key={item.id}
                mr={1}
                mb={1}
                px={2}
                py={1}
                bgColor="blue.50"
                borderRadius="md"
              >
                <IconButton
                  pr={2}
                  aria-label="Uncheck customer"
                  onClick={() => checkedItem(item.id)}
                  variant="iconBtn"
                >
                  <Image src="/assets/images/delete.png" />
                </IconButton>
                <Text fontWeight={600} color="gray.200">
                  {item.name}
                </Text>
              </Flex>
            ),
        )}
      </Flex>
    </Box>
  )
}
