import { Flex, Box } from '@chakra-ui/react'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { SideNavbar } from '../sideNavbar/SideNavbar'

export const Layout: FC = () => (
  <Flex w="full" h="full" overflow="hidden">
    <SideNavbar />
    <Box w="80%" p={8} overflow="auto">
      <Outlet />
    </Box>
  </Flex>
)
