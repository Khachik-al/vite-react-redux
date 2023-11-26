import {
  Circle, Container, Flex, Text,
} from '@chakra-ui/react'

export const StatusModal = ({
  setStatus,
}: {
  setStatus: (s: boolean) => void
}) => (
  <Container variant="statusContainer">
    <Flex
      align="center"
      justify="flex-start"
      cursor="pointer"
      p="2"
      borderRadius="8"
      _hover={{ bg: 'blue.50' }}
      onClick={() => setStatus(true)}
    >
      <Circle size={3} bg="green.500" mr="15px" />
      <Text>Approved</Text>
    </Flex>
    <Flex
      align="center"
      justify="flex-start"
      cursor="pointer"
      p="2"
      borderRadius="8"
      _hover={{ bg: 'blue.50' }}
      onClick={() => setStatus(false)}
    >
      <Circle size={3} bg="yellow" mr="15px" />
      <Text>Hidden</Text>
    </Flex>
  </Container>
)
