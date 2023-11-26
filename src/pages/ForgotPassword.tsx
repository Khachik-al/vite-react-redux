import {
  Flex, VStack, Text, Input, Box, Button, Image,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const ForgotPassword = () => (
  <Flex
    w={['90%', 'full']}
    m={['0 auto', 0]}
    h="100%"
    alignItems="center"
    justifyContent="center"
  >
    <form>
      <VStack
        zIndex={2}
        boxShadow="0px 4px 30px rgba(45, 52, 54, 0.1)"
        borderRadius={32}
        p={[10, 14]}
        alignItems="start"
        position="relative"
      >
        <Button
          variant="primary_button"
          p={3}
          borderRadius={8}
          pos="absolute"
          zIndex={3}
          top={46}
          left={-6}
        >
          <Link to="/login">
            <Image src="../../public/assets/images/arrow-left.png" boxSize={6} />
          </Link>
        </Button>
        <Text variant="form_header">Reset Password</Text>
        <Text maxW={350}>
          Please enter your email address. We will send you an email to reset your password.
        </Text>
        <Box w="full" pt={4}>
          <Text variant="input_label">Email</Text>
          <Input type="email" name="email" placeholder="example@email.com" />
        </Box>
        <Box w="full" pt={8}>
          <Button type="submit" variant="primary_button" py={4} px={8} w="full">
            Reset Password
          </Button>
        </Box>
      </VStack>
    </form>
  </Flex>
)
