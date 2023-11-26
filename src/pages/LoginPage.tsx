import {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react'
import {
  Input,
  Text,
  Box,
  VStack,
  Flex,
  Button,
  Image,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  getUser,
  getUserCfg,
  submitUser,
} from '../redux/slices/auth'
import { useNotifications } from '../hooks/useNotifications'

export const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })

  const { user } = useAppSelector((state) => state.auth)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const resultAction = await dispatch(
      submitUser({ email: formState.email, password: formState.password }),
    )
    if (submitUser.fulfilled.match(resultAction)) {
      showSuccessMessage('You have successfully signed in.')
    } else {
      showErrorMessage('Failed to sign in.')
    }
  }

  useEffect(() => {
    if (user.tag === 'authorized') {
      navigate('/')
    }
    if (user.tag === 'notauthorized') {
      dispatch(getUserCfg())
      dispatch(getUser())
    }
  }, [user.tag])

  return (
    <Flex w="full" h="100%" alignItems="center" justifyContent="center">
      <form onSubmit={handleSubmit}>
        <VStack
          boxShadow="0px 4px 30px rgba(45, 52, 54, 0.1)"
          borderRadius={32}
          p={14}
        >
          <Box w="full">
            <Text variant="input_label">Email</Text>
            <Input
              type="email"
              name="email"
              value={formState.email}
              placeholder="example@email.com"
              onChange={handleInputChange}
            />
          </Box>
          <Box w="full" pt={6} pb={8}>
            <Text variant="input_label">Password</Text>
            <InputGroup>
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                value={formState.password}
                placeholder="······················"
                onChange={handleInputChange}
              />
              <InputRightElement
                cursor="pointer"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <ViewIcon boxSize={5} color="gray.100" />
                ) : (
                  <ViewOffIcon boxSize={5} color="gray.100" />
                )}
              </InputRightElement>
            </InputGroup>
          </Box>
          <Flex justifyContent="end" w="full" mt={8}>
            <Text variant="link" fontWeight={600} color="blue.500">
              <Link to="forgot_password">Forgot Password?</Link>
            </Text>
          </Flex>
          <Box
            w="full"
            pt={8}
            pb={4}
            borderBottom="1px solid"
            borderColor="gray.50"
          >
            <Button
              type="submit"
              variant="primary_button"
              py={4}
              px={8}
              w="full"
            >
              Log In
            </Button>
          </Box>
          <Box w="full" pt={4}>
            <Button
              rightIcon={(
                <Image
                  src="../../public/assets/images/google-icon.png"
                  boxSize={4}
                />
              )}
              variant="secondary_button"
              py={4}
              px={8}
              w="full"
            >
              Log in with Google
            </Button>
          </Box>
        </VStack>
      </form>
    </Flex>
  )
}
