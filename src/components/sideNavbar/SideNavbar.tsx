import {
  Flex, Image, Box, Text,
} from '@chakra-ui/react'
import { useAppDispatch } from '../../redux/hooks'
import { signOutUser } from '../../redux/slices/auth'
import { NavigationList } from './NavigationList'

export const SideNavbar = () => {
  const dispatch = useAppDispatch()

  const handleLogoutSubmit = () => {
    dispatch(signOutUser())
  }

  return (
    <Flex
      direction="column"
      w="20%"
      minW={380}
      h="full"
      py={7}
      px={8}
      borderRight="1px solid"
      borderColor="gray.50"
      justifyContent="space-between"
    >
      <Box>
        <Box mb={16}>
          <Image src="/assets/images/user-default-logo.png" boxSize={104} />
        </Box>
        <NavigationList />
      </Box>
      <Flex alignItems="center" cursor="pointer" onClick={handleLogoutSubmit}>
        <Image src="/assets/images/logout.png" boxSize={4} />
        <Text ml={4} fontWeight={600} color="gray.200">Logout</Text>
      </Flex>
    </Flex>
  )
}
