import { Flex, Text } from '@chakra-ui/react'

type Props = {
  id: string
  name: string
  active: boolean
  onClick: (p: string) => void
}

export const SelectedItem = ({
  id, name, active, onClick,
}: Props) => (
  <Flex
    w="fit-content"
    color={active ? 'main_white' : 'gray.200'}
    bg={active ? 'blue.500' : 'blue.50'}
    alignItems="center"
    borderRadius={8}
    cursor="pointer"
    py={1}
    px={3}
    mt={2}
    onClick={() => onClick(id)}
  >
    <Text>{name}</Text>
  </Flex>
)
