import { VStack } from '@chakra-ui/react'
import { NavLink } from './NavigationListElement'

export const NavigationList = () => (
  <VStack>
    <NavLink
      title="Home"
      linkto="/"
      icon="home-2"
    />
    <NavLink
      title="Content"
      linkto="/content"
      icon="document-copy"
    />
    <NavLink
      title="Devices"
      linkto="/devices"
      icon="mobile"
    />
    <NavLink
      title="My Account"
      linkto="/my-account"
      icon="user-square"
    />
    <NavLink
      title="User Management"
      linkto="/user-management"
      icon="profile-2user"
    />
  </VStack>
)
