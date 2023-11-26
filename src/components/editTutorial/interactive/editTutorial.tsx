import {
  FC, useEffect, useRef, useState,
} from 'react'
import {
  Box,
  Button,
  Checkbox,
  Circle,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  ListItem,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  UnorderedList,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { LanguageSelector } from '../../languageSelector'
import { CustomInput } from '../../CustomInput'
import { StatusModal } from '../../modals/statusModal'
import type {
  Category,
  Tutorial,
  TutorialsData,
} from '../../../interfaces/tutorials.interface'
import type {
  Categories,
  Product,
  ResponseType,
} from '../../../interfaces/data.interface'
import { CreateCategory } from '../../CreateCategory'
import { useNotifications } from '../../../hooks/useNotifications'
import {
  deleteCategory,
  getCategories,
  getCustomers,
  postCategory,
} from '../../../services/api'
import { DeleteDeviceModal } from '../../modals/DeleteDeviceModal'
import { useAppSelector } from '../../../redux/hooks'
import { CustomSelect } from '../../CustomSelect'
import { SelectedItem } from '../../../pages/Content/FAQ/selectedItem'
import { Customer } from '../../../interfaces/metadata.interface'
import { InputCategory } from '../../modals/tutorials/tutorialsInfo'
import { AddDeviceModal } from '../../modals/AddDeviceModal'

type Props = {
  tutorial: TutorialsData
  devices: Product['deviceList'][]
  language: { name: string; id: string }
  setLanguage: (lang: any) => void
  setTutorial: (prev: any) => void
  isOpen: boolean
  onHandleToggleStatus: (status: boolean) => void
  handleCategoriesChange: (prev: any) => void
  handleTutorialChange: (prev: any) => void
  onHandleToggleModal: (prev: any) => void
  title: string
}

export const ContentStatus = ({ status }: { status: boolean }) => {
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

export const EditTutorial: FC<Props> = ({
  language,
  setLanguage,
  tutorial,
  devices,
  isOpen,
  setTutorial,
  onHandleToggleStatus,
  onHandleToggleModal,
  handleCategoriesChange,
  handleTutorialChange,
  title,
}) => {
  const [inputSearch, setInputSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    name: '',
    id: '',
    language: { name: 'English', id: '', code: 'en' },
  })
  const [selectedProducts, setSelectedProducts] = useState<
  { id: string; name: string }[]
  >([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [categories, setCategories] = useState<Categories[]>()
  const [categoryList, setCategoryList] = useState(false)
  const [activeDevice, setActiveDevice] = useState('')
  const {
    auth: { token },
    products: { languages },
  } = useAppSelector((state) => state)
  const { isOpen: isOpenCategory, onOpen, onClose } = useDisclosure()
  const {
    isOpen: deleteModalIsOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure()
  const {
    isOpen: isOpenNewDeviceModal,
    onClose: onCloseDeviceModal,
    onOpen: onOpenDeviceModal,
  } = useDisclosure()
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const [inputCategory, setInputCategory] = useState<InputCategory[]>([])
  const ref = useRef(null)

  useOutsideClick({
    ref,
    handler: () => (categoryList ? setCategoryList(false) : null),
  })

  const getData = async () => {
    try {
      const [customersRes, categoriesRes] = (await Promise.all([
        getCustomers({ token })(),
        getCategories({ token })(),
      ])) as [ResponseType<Customer[]>, ResponseType<Category[]>]
      const [{ data }, { data: categoryData }] = await Promise.all([
        customersRes.json(),
        categoriesRes.json(),
      ])
      if (data || categoryData) {
        setCustomers(() =>
          data.map((item) => {
            if (tutorial.customers.find((i) => i?.id === item.id)?.id) {
              return {
                ...item,
                checked: true,
              }
            }
            return { ...item }
          }))
        setCategories(() =>
          categoryData.map((item) => {
            if (tutorial.categories.find((i) => i?.id === item.id)?.id) {
              return {
                ...item,
                checked: true,
              }
            }
            return { ...item }
          }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCustomersChange = (newCustomers: Customer[]) => {
    setTutorial((prev: Tutorial) => ({
      ...prev,
      customers: newCustomers,
    }))
    setCustomers(newCustomers)
  }

  const handleCheckCategory = (id: string) => {
    const newCategories = categories?.map((item: Categories) => {
      if (id === item.id) {
        return { ...item, checked: !item.checked }
      }
      return item
    })
    setCategories(newCategories)
    setTutorial((prev: TutorialsData) => ({
      ...prev,
      categories: prev.categories.filter((item) => item.id !== id),
    }))
  }

  const addNewCategory = (c: Categories) => {
    const newCategories = categories?.map((item: Categories) => {
      if (c.id === item.id) {
        return { ...item, checked: !item.checked }
      }
      return item
    })
    setCategories(newCategories)
    setTutorial((prev: TutorialsData) => ({
      ...prev,
      categories: [
        ...prev.categories.map((i) => {
          if (c.id === i.id) {
            return { ...i, checked: !i.checked }
          }
          return i
        }),
        {
          name: c.name,
          id: c.id,
          language: c.language,
          checked: true,
        },
      ],
    }))
  }

  const handleInputSlug = ({ target }: { target: { value: string } }) => {
    handleTutorialChange({ ...tutorial, slug: target.value })
  }

  const deleteModalOpen = (category: Category) => {
    onDeleteModalOpen()
    setSelectedCategory(category)
  }

  const addCategory = async () => {
    try {
      const res = Promise.all(
        inputCategory
          .filter((item) => item.title)
          .map(async (item) => {
            const body = {
              languageId: item.languageId,
              name: item.title,
            }
            const data = (await postCategory({
              token,
              body,
            })()) as ResponseType<Category>
            return data.json()
          }),
      )

      const data = await res
      data.forEach((item) => {
        if (item.error) {
          showErrorMessage(`Something wrong: ${item.error}`)
          return
        }
        if (item && item.data.id) {
          const newCategories = {
            id: item.data.id,
            name: item.data.name.replace(/\s+/g, ' ').trim(),
            language,
            checked: false,
          }
          handleCategoriesChange([newCategories, ...tutorial.categories])
          setInputCategory(() =>
            languages.map((i) => ({
              title: '',
              languageId: i.id,
              code: i.code,
              languageName: i.name,
            })))
          showSuccessMessage(item.message)
        }
      })
    } catch (error) {
      showErrorMessage('Something wrong')
    }
  }

  const removeCategory = async () => {
    try {
      const res = (await deleteCategory({
        token,
        id: selectedCategory.id,
      })()) as ResponseType<Category>
      const { message, error } = await res.json()
      if (error) {
        showErrorMessage(message)
        return
      }
      const newCategories = tutorial.categories.filter(
        (item: Category) => item.id !== selectedCategory.id,
      )
      handleCategoriesChange(newCategories)
      showSuccessMessage(message)
      onDeleteModalClose()
    } catch (error) {
      showErrorMessage(`Something wrong: ${error}`)
    }
  }

  const activateDevice = (id: string) => {
    setActiveDevice(id)
    setTutorial((prev: Tutorial) => ({
      ...prev,
      product: {
        id,
        name: selectedProducts.find((item) => item.id === id)?.name,
      },
    }))
  }

  const handleDeviceClick = ({ id, name }: { id: string; name: string }) => {
    const device = selectedProducts.find((p) => p.id === id)

    if (device) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== id))
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          id,
          name,
        },
      ])
    }
  }

  const handleInputTitle = ({ target }: { target: { value: string } }) => {
    const newTutorial = {
      ...tutorial,
      translations: tutorial.translations.map((item) => {
        if (item.language.id === language?.id) {
          return {
            ...item,
            title: target.value,
          }
        }
        return item
      }),
    }
    handleTutorialChange(newTutorial)
  }

  useEffect(() => {
    getData()
    setSelectedProducts(() => [
      { id: tutorial.product.id, name: tutorial.product.name },
    ])
    setActiveDevice(tutorial.product.id)
  }, [])

  useEffect(() => {
    setInputCategory(() =>
      languages.map((i) => ({
        title: '',
        languageId: i.id,
        code: i.code,
        languageName: i.name,
      })))
  }, [languages])

  return (
    <Box
      borderRight="1px solid"
      borderColor="gray.50"
      pr="4"
      w="50%"
      overflowX="hidden"
    >
      <Heading fontSize="lg" mb={4}>
        {title}
      </Heading>
      <LanguageSelector language={language} setLanguage={setLanguage} />
      <Flex flexDir="column" gap="3" mt={4}>
        <CustomInput
          value={
            tutorial.translations.length && language
              ? tutorial.translations.find(
                (item) => item.language.id === language.id,
              )?.title || ''
              : ''
          }
          headingText="Title"
          placeholder="Enter text"
          onBlur={() => null}
          onChange={handleInputTitle}
          isRequired={{
            isRequiredChild: true,
            isNotification: false,
          }}
        />
        <Box>
          <Flex justify="space-between" align="center" pb={2}>
            <Heading as="h3" variant="title" pb={0}>
              Category
            </Heading>
            <Button variant="square_button" onClick={onOpen}>
              <Image src="/assets/images/add.png" boxSize={4} />
              <Text fontSize="xs" fontWeight="700">
                Create Category
              </Text>
            </Button>
            <CreateCategory
              onClose={onClose}
              isOpen={isOpenCategory}
              inputCategory={inputCategory}
              languages={languages}
              setInputCategory={setInputCategory}
              addCategory={addCategory}
              isDisable={false}
            />
          </Flex>
          <DeleteDeviceModal
            isOpen={deleteModalIsOpen}
            onClose={onDeleteModalClose}
            title="Delete Category ?"
            message={`You are about to delete "${selectedCategory.name}"`}
            callback={removeCategory}
            disabled={false}
          />

          <Container
            onFocus={() => setCategoryList(true)}
            ref={ref}
            w="full"
            variant="select"
          >
            <InputGroup>
              <InputLeftElement h={14} pointerEvents="none">
                <Image src="/assets/images/search.png" />
              </InputLeftElement>
              <Input
                h={14}
                border="none"
                placeholder="Search"
                value={inputSearch}
                onChange={({ target }) => setInputSearch(target.value)}
              />
            </InputGroup>
            <UnorderedList
              mt={2}
              ml={0}
              borderTop="1px solid"
              borderColor="gray.50"
              overflowX="hidden"
              w="full"
              maxH={36}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': {
                  width: 4,
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-track': {
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: 4,
                },
              }}
              display={categoryList ? '' : 'none'}
            >
              {categories?.map((item) => {
                if (
                  item.language.id === language?.id
                  && item.name.toLowerCase().includes(inputSearch.toLowerCase())
                ) {
                  return (
                    <ListItem
                      borderRadius="md"
                      m={1}
                      key={item.id}
                      bgColor={item.checked ? 'blue.50' : ''}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Checkbox
                        justifyContent="flex-end"
                        w="100%"
                        p={2}
                        colorScheme="transparent"
                        border="none"
                        iconColor="black"
                        isChecked={item.checked}
                        _checked={{ borderColor: 'transparent' }}
                        sx={{
                          span: {
                            mr: 2,
                            ml: 0,
                            _focusVisible: { boxShadow: 'none' },
                          },
                        }}
                        flexDir="row-reverse"
                        onChange={() => addNewCategory(item)}
                      >
                        {item.name}
                      </Checkbox>
                      <IconButton
                        pr={2}
                        variant="iconBtn"
                        aria-label="Delete category"
                        onClick={() => deleteModalOpen(item)}
                      >
                        <Image src="/assets/images/trash.png" />
                      </IconButton>
                    </ListItem>
                  )
                }
                return null
              })}
            </UnorderedList>
          </Container>
        </Box>
        {categories?.find((i) => i.checked) && (
          <Flex minH={9} maxW={96} flexWrap="wrap">
            {categories
              && categories
                .filter((item) => item.language.id === language.id)
                .map(
                  (item) =>
                    item.checked && (
                      <Flex
                        key={item.id}
                        mr={1}
                        mb={1}
                        px={2}
                        py={1}
                        bgColor="blue.50"
                        borderRadius="md"
                      >
                        <IconButton
                          pr={2}
                          variant="iconBtn"
                          aria-label="Uncheck category"
                          onClick={() => handleCheckCategory(item.id)}
                          icon={<Image src="/assets/images/delete.png" />}
                        />
                        <Text fontWeight={600} color="gray.200">
                          {item.name}
                        </Text>
                      </Flex>
                    ),
                )}
          </Flex>
        )}
        <CustomInput
          value={tutorial.slug}
          headingText="Slug"
          placeholder="Enter text"
          onChange={handleInputSlug}
          isRequired={{ isNotification: false, isRequiredChild: false }}
          onBlur={() => null}
        />
        <Box width="full">
          <Box>
            <Text fontWeight={600} mb={2}>
              Select Devices
            </Text>
            <Flex>
              <Menu variant="multiselect" closeOnSelect={false}>
                <MenuButton h={14} fontSize="md" alignItems="center">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text>Select Devices</Text>
                    <ChevronDownIcon boxSize={5} color="main_black" />
                  </Flex>
                </MenuButton>
                <MenuList zIndex={8}>
                  <MenuOptionGroup type="checkbox">
                    {!devices.length ? (
                      <MenuItemOption value="">No Data</MenuItemOption>
                    ) : (
                      devices.map((device) => (
                        <MenuItemOption
                          key={device.id}
                          value={device.product.id}
                          onClick={() => {
                            handleDeviceClick({
                              id: device.product.id,
                              name: device.product.name,
                            })
                          }}
                        >
                          {device.product.name}
                        </MenuItemOption>
                      ))
                    )}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
              <Button
                variant="outlined_button"
                fontSize="sm"
                borderRadius="lg"
                display="flex"
                gap="1"
                onClick={onOpenDeviceModal}
              >
                <Text as="b" color="black">
                  +
                </Text>
                <Text>Add More Devices</Text>
              </Button>
              <AddDeviceModal
                currentPage={0}
                pageSize={0}
                device={null}
                isOpen={isOpenNewDeviceModal}
                onClose={onCloseDeviceModal}
              />
            </Flex>
            <Flex gap={2} overflowX="auto">
              {selectedProducts.map((device) => (
                <SelectedItem
                  key={device.id}
                  id={device.id}
                  name={device.name || ''}
                  active={activeDevice === device.id}
                  onClick={activateDevice}
                />
              ))}
            </Flex>
          </Box>
        </Box>
        <CustomSelect
          headingText="Select Customer"
          text="Select Customer"
          list={customers}
          changeList={handleCustomersChange}
          zIndex={7}
          isRequired={{ isNotification: false, isRequiredChild: false }}
          onBlur={() => null}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Heading as="h3" variant="title" alignItems="center">
            Status
          </Heading>
          {isOpen ? (
            <StatusModal setStatus={onHandleToggleStatus} />
          ) : (
            <Flex
              w={105}
              p="2"
              minH="10"
              align="center"
              cursor="pointer"
              borderRadius={8}
              bgColor="lightest_blue"
              justify="space-between"
              onClick={onHandleToggleModal}
            >
              {typeof tutorial.is_public === 'boolean' ? (
                <ContentStatus status={tutorial.is_public} />
              ) : (
                <>
                  <Circle size={3} bg="gray.100" />
                  <Text>Set Status</Text>
                </>
              )}
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  )
}
