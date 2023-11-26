import { Container, Flex, Spinner } from '@chakra-ui/react'
import { FC, ReactNode, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getUserCfg, getUser } from '../redux/slices/auth'

export const LoaderWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user, loading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (user.tag === 'notauthorized') dispatch(getUser())
    if (!token && user.tag === 'authorized') dispatch(getUserCfg())
  }, [token, user.tag])

  return (
    <Container variant="loaderWrapper">
      {loading || (user.tag === 'authorized' && !token) ? (
        <Flex h="full" justifyContent="center" alignItems="center">
          <Spinner thickness="7px" speed="0.85s" color="blue.500" size="xl" />
        </Flex>
      ) : (
        children
      )}
    </Container>
  )
}
