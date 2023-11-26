import {
  Box,
  HStack,
  Text,
  Flex,
  Input,
  Button,
  MenuButton,
  MenuList,
  MenuOptionGroup, Menu, useDisclosure, MenuItemOption, Select,
} from '@chakra-ui/react'
import {
  ChangeEvent, useEffect, useMemo, useState,
} from 'react'
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { generateSlug } from '../../../utils/generateSlug'
import { SelectedItem } from './selectedItem'
import { CreateCategoryModal } from '../../../components/modals/faq/createCategoryModal'
import { CreateChildCategoryModal } from '../../../components/modals/faq/createChildCategoryModal'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import {
  addFaq, editFaq,
  getChildCategories,
  getParentCategories,
  getSingleFaq, resetCurrentFaq,
} from '../../../redux/slices/faq'
import { getMetadata } from '../../../redux/slices/metadata'
import { getDevices } from '../../../redux/slices/products'
import { DeviceList } from '../../../interfaces/data.interface'
import {
  LanguageObject,
  ChildCategory,
  ParentCategory,
  FaqBody,
  Translation,
} from '../../../interfaces/faq.interface'
import { Language } from '../../../interfaces/features.interface'
import { Language as LanguageEnum } from '../../../interfaces/feature.interface'
import { useNotifications } from '../../../hooks/useNotifications'
import { mapFaqProducts } from '../../../utils/helper'
import { LocalLoader } from '../../../components/localLoader'
import { TextEditor } from '../../../components/modals/TextEditor'

type SelectedProduct = {
  id: string
  customerIds: string[]
  name?: string
}

export const AddFaq = () => {
  const dispatch = useAppDispatch()
  const { id: faqId } = useParams()
  const navigate = useNavigate()
  const [isEdit] = useState(faqId !== 'add')
  const { deviceList: devices } = useAppSelector((state) => state.products.devices)
  const { metadata } = useAppSelector((state) => state.metadata)
  const { currentFaq, singleFaqLoading } = useAppSelector((state) => state.faq)
  const { parentCategories, childCategories } = useAppSelector((state) => state.faq)
  const {
    onClose: onCategoryClose,
    onOpen: onCategoryOpen,
    isOpen: isCategoryOpen,
  } = useDisclosure()
  const {
    onClose: onEditorClose,
    onOpen: onEditorOpen,
    isOpen: isEditorOpen,
  } = useDisclosure()
  const {
    onClose: onChildClose,
    onOpen: onChildOpen,
    isOpen: isChildOpen,
  } = useDisclosure()
  const { showSuccessMessage, showErrorMessage } = useNotifications()
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageObject | null>(null)
  const [slug, setSlug] = useState('')
  const { languages } = useAppSelector((state) => state.metadata.metadata)
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [activeDevice, setActiveDevice] = useState('')
  const [selectedDevice, setSelectedDevice] = useState<DeviceList | null>(null)
  const [selectedParent, setSelectedParent] = useState<ParentCategory | null>(null)
  const [selectedChild, setSelectedChild] = useState<ChildCategory | null>(null)
  const [status, setStatus] = useState('')
  const [inputState, setInputState] = useState({
    English: {
      title: '',
      answer: '',
    },
    'Formal Spanish': {
      title: '',
      answer: '',
    },
    'Informal Spanish': {
      title: '',
      answer: '',
    },
  })
  const requiredLanguage: Language = useMemo(() => {
    if (languages.length) {
      const t = languages.find(
        (item) => item.name === import.meta.env.VITE_DEFAULT_LANGUAGE,
      ) || languages[1]
      return t
    }
    return {
      name: 'English',
      id: '',
      code: 'en',
    }
  }, [languages])

  const [selectedLanguageName, setSelectedLanguageName] = useState<
  'English' | 'Formal Spanish' | 'Informal Spanish'
  >('English')

  const handleParentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const parentCategory = parentCategories.find((p) => p.id === e.target.value)
    if (parentCategory) setSelectedParent(parentCategory)
  }
  const handleChildChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const childCategory = childCategories.find((c) => c.id === e.target.value)
    if (childCategory) setSelectedChild({ ...childCategory })
  }

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value)
  }

  const activateDevice = (id: string) => {
    setActiveDevice(id)
  }

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug(generateSlug(e.target.value))
  }

  const handleCustomerClick = (id: string, customerId: string) => {
    const products = selectedProducts.filter((p) => p.id !== id)
    const product = selectedProducts.find((p) => p.id === id)

    if (!product) return
    let changedDevice
    if (product.customerIds.includes(customerId)) {
      changedDevice = {
        ...product,
        customerIds: product.customerIds.filter((i) => i !== customerId),
      }
    } else {
      changedDevice = {
        ...product,
        customerIds: [...product.customerIds, customerId],
      }
    }

    setSelectedProducts([
      ...products,
      changedDevice,
    ])
  }

  const handleLanguageSelect = (l: 'English' | 'Formal Spanish' | 'Informal Spanish') => {
    const language = metadata.languages.find((lang) => lang.name === l)
    if (language) {
      setSelectedLanguageName(l)
      setSelectedLanguage(language)
    }
  }

  const handleDeviceClick = ({ id, name }: { id: string, name: string }) => {
    const device = selectedProducts.find((p) => p.id === id)

    if (device) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== id))
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          id,
          name,
          customerIds: [],
        },
      ])
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputState({
      ...inputState,
      [selectedLanguageName]: {
        ...inputState[selectedLanguageName],
        [e.target.name]: e.target.value,
      },
    })
  }

  const handleEditorChange = (value: string) => {
    setInputState({
      ...inputState,
      [selectedLanguageName]: {
        ...inputState[selectedLanguageName],
        answer: value,
      },
    })
  }

  const handleSave = async () => {
    const translations: Translation[] = []

    const obj: FaqBody = {
      isPublic: !!status,
      title: inputState.English.title,
      answer: inputState.English.answer,
      childCategoryId: selectedChild?.id || '',
      products: selectedProducts.map((sp) => ({
        id: sp.id,
        customerIds: sp.customerIds,
        slug,
      })),
      translations,
    }
    if (!inputState.English.title || !inputState.English.answer) return
    (Object.keys(inputState) as Array<keyof typeof inputState>).forEach(
      (key: keyof typeof inputState) => {
        if (key === 'English') return
        if (inputState[key].title && inputState[key].answer) {
          const language = metadata.languages.find((l) => l.name === (key as LanguageEnum))
          translations.push({
            title: inputState[key].title,
            answer: inputState[key].answer,
            language: {
              id: language?.id || '',
              name: language?.name || '',
            },
          })
        }
      },
    )

    if (isEdit && faqId) {
      const resultAction = await dispatch(editFaq({ id: faqId, body: obj }))

      if (editFaq.fulfilled.match(resultAction)) {
        const data = resultAction.payload
        if (data.error) {
          showErrorMessage(`${data.error}: ${data.message}`)
          return
        }
        showSuccessMessage(data.message)
      }
    } else {
      const resultAction = await dispatch(addFaq(obj))

      if (addFaq.fulfilled.match(resultAction)) {
        const { payload } = resultAction
        if (payload.error) {
          showErrorMessage(`${payload.error}: ${payload.message}`)
          return
        }
        showSuccessMessage('Successfully added FAQ.')
      }
    }

    navigate('/content')
  }

  useEffect(() => () => {
    dispatch(resetCurrentFaq())
  }, [])

  useEffect(() => {
    dispatch(getMetadata())
    dispatch(getDevices({ productType: 'parent' }))
  }, [])

  useEffect(() => {
    if (!faqId) return
    if (!isEdit) {
      dispatch(resetCurrentFaq())
      return
    }
    dispatch(getSingleFaq(faqId))
  }, [faqId])

  useEffect(() => {
    if (isEdit) return
    setSlug(generateSlug(inputState.English.title))
  }, [inputState.English.title])

  useEffect(() => {
    setSelectedLanguage(
      metadata.languages.find((l) => l.name === selectedLanguageName) || null,
    )
  }, [metadata.languages])

  useEffect(() => {
    dispatch(getParentCategories())
  }, [])

  useEffect(() => {
    if (selectedParent?.id) {
      dispatch(getChildCategories({
        parentId: selectedParent.id,
      }))
    }
  }, [selectedParent?.id])

  useEffect(() => {
    setSelectedChild(null)
  }, [selectedParent?.id])

  useEffect(() => {
    if (selectedProducts.length === 0) setActiveDevice('')
  }, [selectedProducts.length])

  useEffect(() => {
    const currentDevice = devices.find((d) => d.product.id === activeDevice)
    if (!currentDevice) return
    setSelectedDevice(currentDevice)
  }, [activeDevice])

  useEffect(() => {
    if (!currentFaq) return
    const formalSpanish = currentFaq?.translations.find((t) => t.language.name === 'Formal Spanish')
    const informalSpanish = currentFaq?.translations.find(
      (t) => t.language.name === 'Informal Spanish',
    )
    setInputState({
      English: {
        title: currentFaq.title,
        answer: currentFaq.answer,
      },
      'Formal Spanish': {
        title: formalSpanish?.title || '',
        answer: formalSpanish?.answer || '',
      },
      'Informal Spanish': {
        title: informalSpanish?.title || '',
        answer: informalSpanish?.answer || '',
      },
    })
  }, [currentFaq])

  useEffect(() => {
    if (!currentFaq) return
    setSelectedChild({
      id: currentFaq?.child_category.id || '',
      name: currentFaq?.child_category.name || '',
      language: {
        id: requiredLanguage.id,
        name: requiredLanguage.name,
      },
      category: {
        id: currentFaq?.child_category.category.id || '',
        name: currentFaq?.child_category.category.name || '',
        language: {
          id: requiredLanguage.id,
          name: requiredLanguage.name,
        },
      },
      translations: currentFaq.child_category.translations,
    })
  }, [currentFaq])

  useEffect(() => {
    if (!currentFaq) return
    setSelectedProducts(mapFaqProducts(currentFaq?.faqsProducts || []))
    setStatus(currentFaq.is_public ? 'true' : '')
  }, [currentFaq])

  useEffect(() => {
    if (!currentFaq) return
    setSelectedParent({
      id: currentFaq?.child_category.category.id || '',
      name: currentFaq?.child_category.category.name || '',
      language: {
        id: requiredLanguage.id,
        name: requiredLanguage.name,
      },
    })
  }, [currentFaq])

  useEffect(() => {
    if (!currentFaq) return
    setSlug(
      Array.isArray(currentFaq?.faqsProducts)
        ? currentFaq?.faqsProducts[0]?.slug
        : '',
    )
  }, [currentFaq])

  if (isEdit && singleFaqLoading) return <LocalLoader />

  return (
    <>
      <TextEditor
        onClose={onEditorClose}
        isOpen={isEditorOpen}
        onChange={handleEditorChange}
        lang={selectedLanguage?.id || ''}
        defaultValue={inputState[selectedLanguageName].answer}
      />
      <CreateCategoryModal
        onClose={onCategoryClose}
        isOpen={isCategoryOpen}
        languageId={selectedLanguage?.id || ''}
        requiredLanguage={requiredLanguage}
        languages={languages}
      />
      <CreateChildCategoryModal
        onClose={onChildClose}
        isOpen={isChildOpen}
        requiredLanguage={requiredLanguage}
        languages={languages}
      />
      <Box>
        <Text
          fontSize={24}
          fontWeight={600}
        >
          Content
        </Text>
        <Text fontWeight={600}>
          Content
          {' '}
          {'>'}
          {' '}
          FAQ Name 1
        </Text>
        <Text
          mt={8}
          fontSize={18}
          fontWeight={600}
        >
          FAQ Name 1
        </Text>
        <HStack alignItems="baseline">
          <Flex
            direction="column"
            w="50%"
            gap={6}
          >
            <Box
              borderRight="1px solid"
              borderColor="gray.50"
              pr={8}
            >
              <Text fontWeight={600} mb={2} mt={4}>
                Language
              </Text>
              <Flex
                borderRadius={40}
                bg="blue.50"
                gap={1}
                p={1}
              >
                {
                  metadata.languages.map((language) => (
                    <Box
                      key={language.id}
                      borderRadius={40}
                      cursor="pointer"
                      py={3}
                      px={4}
                      bg={
                        language.name === selectedLanguageName ? 'blue.500' : 'inherit'
                      }
                      fontSize={16}
                      fontWeight={
                        language.name === selectedLanguageName ? 600 : 'inherit'
                      }
                      color={
                        language.name === selectedLanguageName ? 'main_white' : 'inherit'
                      }
                      onClick={() => {
                        handleLanguageSelect(
                          language.name as 'English' | 'Formal Spanish' | 'Informal Spanish',
                        )
                      }}
                    >
                      {language.name}
                    </Box>
                  ))
                }
              </Flex>
              <Flex
                direction="column"
                gap={4}
                mt={6}
              >
                <Box>
                  <Flex>
                    <Text
                      fontWeight={600}
                    >
                      Title
                    </Text>
                    <Text color="blue.500" ml={1}>*</Text>
                  </Flex>
                  <Input
                    onChange={handleInputChange}
                    name="title"
                    value={inputState[selectedLanguageName].title}
                    placeholder="Enter Text"
                    _placeholder={{
                      fontSize: 14,
                    }}
                  />
                </Box>
                <Box>
                  <Flex mb={2}>
                    <Flex>
                      <Text fontWeight={600}>
                        Answer
                      </Text>
                      <Text color="blue.500" ml={1}>*</Text>
                    </Flex>
                    <Button ml={2} onClick={onEditorOpen}>
                      Edit
                    </Button>
                  </Flex>
                  <Box
                    border="1px solid"
                    borderColor="gray.50"
                    borderRadius={10}
                    h={28}
                    p={2}
                    overflow="auto"
                    cursor="text"
                    onClick={onEditorOpen}
                  >
                    {!inputState[selectedLanguageName].answer && (
                      <Text color="gray.500">Edit step text...</Text>
                    )}
                    <Box
                      p={3}
                      dangerouslySetInnerHTML={{
                        __html: inputState[selectedLanguageName].answer,
                      }}
                    />
                  </Box>
                </Box>
              </Flex>
            </Box>
            <Flex
              direction="column"
              gap={6}
              pr={8}
            >
              <Box>
                <Text
                  fontWeight={600}
                  mb={2}
                >
                  Select Devices
                </Text>
                <Menu variant="multiselect" closeOnSelect={false}>
                  <MenuButton>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text>Select Devices</Text>
                      <ChevronDownIcon boxSize={5} color="main_black" />
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup
                      type="checkbox"
                    >
                      {
                        !devices.length ? (
                          <MenuItemOption value="">
                            No Data
                          </MenuItemOption>
                        ) : devices.map((device) => (
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
                      }
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
                <Flex gap={2} overflowX="auto">
                  {
                    selectedProducts.map((device) => (
                      <SelectedItem
                        key={device.id}
                        id={device.id}
                        name={device.name || ''}
                        active={activeDevice === device.id}
                        onClick={activateDevice}
                      />
                    ))
                  }
                </Flex>
              </Box>
              <Box>
                <Text
                  fontWeight={600}
                  mb={2}
                >
                  Select Customer
                </Text>
                <Menu variant="multiselect" closeOnSelect={false}>
                  <MenuButton>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text>Select Customer</Text>
                      <ChevronDownIcon boxSize={5} color="main_black" />
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup
                      type="checkbox"
                      key={selectedDevice?.id || ''}
                    >
                      {
                        !selectedDevice || !selectedDevice.product.customers.length ? (
                          <MenuItemOption value="">
                            No Data
                          </MenuItemOption>
                        ) : selectedDevice.product.customers.map((customer) => (
                          <MenuItemOption
                            key={customer.id}
                            value={customer.id}
                            onClick={() => {
                              handleCustomerClick(selectedDevice.product.id, customer.id)
                            }}
                          >
                            {customer.name}
                          </MenuItemOption>
                        ))
                      }
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
                <Flex overflowX="auto" gap={2} mt={3}>
                  {
                     selectedProducts.find(
                       (p) => p.id === activeDevice,
                     )?.customerIds.map((customerId) => (
                       <Box borderRadius={8} py={1} px={3} bg="blue.50">
                         {
                           selectedDevice?.product.customers.find(
                             (c) => c.id === customerId,
                           )?.name
                         }
                       </Box>
                     ))
                  }
                </Flex>
              </Box>
            </Flex>
          </Flex>
          <Flex
            direction="column"
            gap={6}
            pl={8}
            w="50%"
          >
            <Flex justifyContent="space-between">
              <Flex>
                <Text
                  fontWeight={600}
                >
                  Status
                </Text>
                <Text ml={1} color="blue.500">*</Text>
              </Flex>
              <Select
                w="fit-content"
                bg="blue.50"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="">Hidden</option>
                <option value="true">Approved</option>
              </Select>
            </Flex>
            <Box>
              <Flex justifyContent="space-between" mb={2}>
                <Flex>
                  <Text
                    fontWeight={600}
                  >
                    Category
                  </Text>
                  <Text color="blue.500" ml={1}>*</Text>
                </Flex>
                <Button
                  variant="square_button"
                  onClick={onCategoryOpen}
                  bg="blue.500"
                >
                  <AddIcon boxSize={2} />
                  <Text
                    fontSize={12}
                    lineHeight={5}
                    ml={2}
                  >
                    Create Category
                  </Text>
                </Button>
              </Flex>
              <Select
                placeholder="Select Category"
                value={selectedParent?.id || ''}
                onChange={handleParentChange}
              >
                {
                  parentCategories.map((parentCategory) => (
                    <option key={parentCategory.id} value={parentCategory.id}>
                      {parentCategory.name}
                    </option>
                  ))
                }
              </Select>
            </Box>
            <Box>
              <Flex justifyContent="space-between" mb={2}>
                <Flex>
                  <Text
                    fontWeight={600}
                  >
                    Child Category
                  </Text>
                  <Text color="blue.500" ml={1}>*</Text>
                </Flex>
                <Button
                  variant="square_button"
                  bg="blue.500"
                  onClick={onChildOpen}
                >
                  <AddIcon boxSize={2} />
                  <Text
                    fontSize={12}
                    lineHeight={5}
                    ml={2}
                  >
                    Create Child Category
                  </Text>
                </Button>
              </Flex>
              <Select
                placeholder="Select Child Category"
                value={selectedChild?.id || ''}
                onChange={handleChildChange}
              >
                {
                  childCategories.map((childCategory) => (
                    <option key={childCategory.id} value={childCategory.id}>
                      {childCategory.name}
                    </option>
                  ))
                }
              </Select>
            </Box>
            <Box>
              <Flex>
                <Text
                  fontWeight={600}
                  mb={2}
                >
                  Slug
                </Text>
                <Text color="blue.500" ml={1}>*</Text>
              </Flex>
              <Input
                onChange={handleSlugChange}
                name="slug"
                value={slug}
                placeholder="Enter Slug"
                _placeholder={{
                  fontSize: 14,
                }}
              />
            </Box>
          </Flex>
        </HStack>
        <Flex pb={30} justifyContent="end" gap={4}>
          <Button
            variant="secondary_button"
            borderColor="gray.100"
            color="gray.100"
            px={8}
            py={4}
            onClick={() => navigate('/content')}
          >
            Cancel
          </Button>
          <Button
            px={8}
            py={4}
            onClick={handleSave}
          >
            Save
          </Button>
        </Flex>
      </Box>
    </>
  )
}
