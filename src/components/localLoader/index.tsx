import { Container, Spinner } from '@chakra-ui/react'

export const LocalLoader = () => (
  <Container m={0} p={0} w="none" display="flex">
    <Spinner w={4} h={4} />
  </Container>
)
