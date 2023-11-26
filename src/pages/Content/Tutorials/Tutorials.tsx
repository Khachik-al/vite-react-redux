import {
  Button,
  Container,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react'
import { NewTutorials } from '../../../components/modals/tutorials'

export const Tutorials = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Container p={0} m={0} maxW="none">
      <Heading>Tutorials</Heading>
      <Flex justifyContent="flex-end" gap={3}>
        <Button px={8} py={4} variant="secondary_button">
          Import
        </Button>
        <Button onClick={onOpen}>Add Tutorial</Button>
      </Flex>
      <NewTutorials isOpen={isOpen} onClose={onClose} />
    </Container>
  )
}
