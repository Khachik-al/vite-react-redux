import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Box, Flex, Image, Text,
} from '@chakra-ui/react'

type NestProps = {
  title: string
  icon: string
  children: ReactNode
}
export const Nest = ({
  title,
  icon,
  children,
}: NestProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Box
      w="full"
      pb={isOpen ? 3 : 0}
      borderBottom={isOpen ? '1px solid' : ''}
      borderColor="gray.50"
    >
      <Box
        cursor="pointer"
        _hover={{ bg: 'gray.50' }}
        borderRadius={4}
        color="gray.200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flex px={4} py={3}>
          <Flex w="full">
            <Box>
              <Image
                src={`/assets/images/${icon}.png`}
                boxSize={4}
              />
            </Box>
            <Text fontWeight={600} ml={4}>{title}</Text>
          </Flex>
          <Image
            src={`/assets/images/arrow-down${isOpen ? '-white' : ''}.png`}
            boxSize={4}
          />
        </Flex>
      </Box>
      {!isOpen
        ? null
        : <Box px={2}>{children}</Box>}
    </Box>
  )
}

type NavLinkProps = {
  title: string
  linkto: string
  icon: string
}
export const NavLink = ({
  title,
  linkto,
  icon,
}: NavLinkProps) => {
  const { pathname } = useLocation()
  const isCurrent = pathname === linkto
  return (
    <Box
      w="full"
      bg={isCurrent ? 'blue.500' : 'inherit'}
      cursor="pointer"
      _hover={!isCurrent ? { bg: 'gray.50' } : {}}
      borderRadius={4}
      color={isCurrent ? 'main_white' : 'gray.200'}
    >
      <Link to={linkto}>
        <Flex px={4} py={3}>
          <Flex w="full">
            <Box>
              <Image
                src={`/assets/images/${!isCurrent ? icon : `${icon}-white`}.png`}
                boxSize={4}
              />
            </Box>
            <Text fontWeight={600} ml={4}>{title}</Text>
          </Flex>
        </Flex>
      </Link>
    </Box>
  )
}
