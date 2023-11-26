import {
  Box,
  Circle,
  Flex,
  Image,
  ListItem,
  OrderedList,
  Spinner,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { Content } from '../../interfaces/data.interface'
import { SingleFaq } from '../../interfaces/faq.interface'
import { Customer } from '../../interfaces/metadata.interface'
import { useAppSelector } from '../../redux/hooks'
import { getTutorial } from '../../services/api/content.service'
import { getFaqById } from '../../services/api/faq.service'
import { LocalLoader } from '../localLoader'

type Props = {
  content: Content
  onClick: (id: string, type: 'faq' | 'tutorial') => void
  cloneContent: ({ id, type }: { id: string; type: 'faq' | 'tutorial' }) => void
  loading: string
}

const ContentStatus = ({ status }: { status: boolean }) => {
  if (status) {
    return (
      <Flex gap="3" alignItems="center">
        <Circle size={3} bg="green.500" />
        <Text>Approved</Text>
      </Flex>
    )
  }
  return (
    <Flex gap="3" alignItems="center">
      <Circle size={3} bg="yellow" />
      <Text>Hidden</Text>
    </Flex>
  )
}

const renderArticleType = ({ type }: { type: 'faq' | 'tutorial' }) => {
  switch (type) {
    case 'faq':
      return 'FAQ'
    case 'tutorial':
      return 'Tutorial'
    default:
      return 'Not Defined'
  }
}

export const ShowCustomers = ({
  customers,
  isLoadingCustomers,
}: {
  customers: Customer[]
  isLoadingCustomers: boolean
}) => (
  <Flex
    position="absolute"
    bgColor="white"
    border="1px solid"
    borderColor="blue.400"
    flexDir="column"
    borderRadius={5}
    p={2}
    right={20}
    justify="flex-end"
  >
    {isLoadingCustomers ? (
      <Spinner />
    ) : (
      <OrderedList>
        {customers.length === 0 ? (
          <Text color="red">No data</Text>
        ) : (
          customers.map((item) => <ListItem key={item.id}>{item.name}</ListItem>)
        )}
      </OrderedList>
    )}
  </Flex>
)

export const ContentTableRow = ({
  content,
  cloneContent,
  loading,
  onClick,
}: Props) => {
  const {
    auth: { token },
  } = useAppSelector((state) => state)
  const [onHoverCustomer, setOnHoverCustomer] = useState(false)
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])

  const getCustomersTutorial = async () => {
    const res = (await getTutorial({
      id: content.id,
      token,
    })()) as { json: () => { data: { customers: Customer[] } } }
    const { data } = await res.json()
    if (!data) return
    setCustomers(data.customers)
    setIsLoadingCustomers(false)
  }

  const getCustomersFaq = async () => {
    const res = (await getFaqById({ token, id: content.id })) as {
      json: () => { data: SingleFaq }
    }
    const {
      data: { faqsProducts },
    } = await res.json()
    if (!faqsProducts) return
    const [newCustomers] = faqsProducts.map((item) => item.customers)
    setCustomers([...newCustomers])
    setIsLoadingCustomers(false)
  }

  const onMouseOver = () => {
    setOnHoverCustomer(true)
    if (!isLoadingCustomers) return
    switch (content.type) {
      case 'tutorial':
        getCustomersTutorial()
        break
      case 'faq':
        getCustomersFaq()
        break
      default:
        break
    }
  }

  useEffect(() => {
    setIsLoadingCustomers(true)
  }, [content])

  return (
    <Tr
      cursor="pointer"
      _hover={{ bg: 'blue.50' }}
      onClick={() => onClick(content.id, content.type)}
    >
      <Td>{content.full_title}</Td>
      <Td>{`${content.manufacturer} - ${content.product_name}`}</Td>
      <Td>{content.category}</Td>
      <Td>{renderArticleType({ type: content.type })}</Td>
      <Td>
        <ContentStatus status={content.status} />
      </Td>
      <Td>
        <Flex
          justifyContent="center"
          gap="2"
          align="center"
          position="relative"
        >
          <Box
            onMouseOver={onMouseOver}
            onMouseLeave={() => setOnHoverCustomer(false)}
          >
            <Image src="assets/images/profile-circle.svg" />
          </Box>
          {onHoverCustomer && (
            <ShowCustomers
              customers={customers}
              isLoadingCustomers={isLoadingCustomers}
            />
          )}
          {loading !== content.id ? (
            <Image
              onClick={() =>
                cloneContent({ id: content.id, type: content.type })}
              src="assets/images/copy-content.svg"
            />
          ) : (
            <LocalLoader />
          )}
        </Flex>
      </Td>
    </Tr>
  )
}
