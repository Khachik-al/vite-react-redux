import {
  Box,
  Checkbox,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  ListItem,
  Select,
  Text,
  UnorderedList,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react'
import { useMemo, useRef, useState } from 'react'
import { useNotifications } from '../../../hooks/useNotifications'
import { ResponseType } from '../../../interfaces/data.interface'
import { Language } from '../../../interfaces/features.interface'
import {
  Category,
  Customer,
  Tutorial,
  ValidationForm,
} from '../../../interfaces/tutorials.interface'
import { useAppSelector } from '../../../redux/hooks'
import { deleteCategory, postCategory } from '../../../services/api'
import { generateSlug } from '../../../utils/generateSlug'
import { CreateCategory } from '../../CreateCategory'
import { CustomInput } from '../../CustomInput'
import { CustomSelect } from '../../CustomSelect'
import { LanguageSelector } from '../../languageSelector'
import { LocalLoader } from '../../localLoader'
import { RequiredMark } from '../../RequiredMark'
import { DeleteDeviceModal } from '../DeleteDeviceModal'

export type InputCategory = {
  title: string
  languageId: string
  code: string
  languageName: string
}

const TYPE = [
  {
    name: 'Interactive',
    id: '0',
  },
  {
    name: 'HTML5',
    id: '1',
  },
]

export const TutorialsInfo = ({
  categories,
  customers,
  tutorial,
  language,
  isRequired,
  validationForm,
  handleCategoriesChange,
  handleCustomersChange,
  showNotificationRequired,
  handleTutorialChange,
  handleValidationFormChange,
  handleLanguageChange,
  requiredLanguage,
}: {
  categories: Category[]
  customers: Customer[]
  tutorial: Tutorial
  language: Language
  isRequired: {
    [key: string]: {
      isRequiredChild: boolean
      isNotification: boolean
    }
  }
  validationForm: ValidationForm
  handleCategoriesChange: (value: any) => void
  handleCustomersChange: (value: Customer[]) => void
  showNotificationRequired: (name: string) => void
  handleTutorialChange: (value: Tutorial) => void
  handleValidationFormChange: (value: ValidationForm) => void
  handleLanguageChange: (value: Language) => void
  requiredLanguage: Language
}) => {
  const { token } = useAppSelector((state) => state.auth)
  const {
    devices: { deviceList: products },
  } = useAppSelector((state) => state.products)
  const { languages } = useAppSelector((state) => state.products)
  const [categoryList, setCategoryList] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [inputCategory, setInputCategory] = useState<InputCategory[]>([
    {
      title: '',
      languageId: languages[0].id,
      code: 'en',
      languageName: languages[0].name,
    },
    {
      title: '',
      languageId: languages[2].id,
      code: 'es',
      languageName: languages[2].name,
    },
    {
      title: '',
      languageId: languages[1].id,
      code: 'informal_es',
      languageName: languages[1].name,
    },
  ])
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    name: '',
    id: '',
    language: { name: 'English', id: '', code: '' },
  })
  const [isDisableCreateBtn, setIsDisableCreateBtn] = useState(false)
  const [isDeleteCategoryLoading, setIsPostTutorialLoading] = useState(false)
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const {
    isOpen: deleteModalIsOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure()
  const ref = useRef(null)

  useOutsideClick({
    ref,
    handler: () => (categoryList ? setCategoryList(false) : ''),
  })

  const renderProducts = useMemo(
    () => products.filter((item) => item.reference_type === 'parent'),
    [products],
  )

  const addCategory = async () => {
    setIsDisableCreateBtn(true)
    try {
      const newCategories: Category[] = []
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
          setIsDisableCreateBtn(false)
          return
        }
        if (item && item.data.id) {
          const newCategory = {
            ...item.data,
            id: item.data.id,
            name: item.data.name.replace(/\s+/g, ' ').trim(),
            checked: false,
          }
          setInputCategory(() =>
            languages.map((i) => ({
              title: '',
              languageId: i.id,
              code: i.code,
              languageName: i.name,
            })))
          showSuccessMessage(item.message)
          newCategories.push(newCategory)
        }
      })
      handleCategoriesChange([...categories, ...newCategories])
    } catch (error) {
      showErrorMessage('Something wrong')
    }
    setIsDisableCreateBtn(false)
  }

  const deleteModalOpen = (category: Category) => {
    onDeleteModalOpen()
    setSelectedCategory(category)
  }

  const removeCategory = async () => {
    setIsPostTutorialLoading(true)
    try {
      const res = (await deleteCategory({
        token,
        id: selectedCategory.id,
      })()) as ResponseType<Category>
      const { message, error } = await res.json()
      if (error) {
        showErrorMessage(message)
        setIsPostTutorialLoading(false)
        return
      }
      const newCategories = categories.filter(
        (item: Category) => item.id !== selectedCategory.id,
      )
      handleCategoriesChange(newCategories)
      showSuccessMessage(message)
      onDeleteModalClose()
    } catch (error) {
      showErrorMessage(`Something wrong: ${error}`)
    }
    setIsPostTutorialLoading(false)
  }

  const autofillSlug = () => {
    const slug = generateSlug(tutorial.title)
    handleTutorialChange({ ...tutorial, slug })
  }

  const handleCheckCategory = (id: string) => {
    const newCategories = categories.map((item) => {
      if (id === item.id) {
        return { ...item, checked: !item.checked }
      }
      return item
    })
    handleCategoriesChange(newCategories)
  }

  const handleInputTitle = ({ target }: { target: { value: string } }) => {
    const newTutorial = {
      ...tutorial,
      title:
        language?.name === requiredLanguage.name
          ? target.value
          : tutorial.title,
      translations: tutorial.translations.map((item) => {
        if (item.languageId === language?.id) {
          return {
            languageId: item.languageId,
            value: {
              title: target.value,
            },
          }
        }
        return item
      }),
    }
    handleTutorialChange(newTutorial)
    handleValidationFormChange({
      ...validationForm,
      title:
        language?.name === requiredLanguage.name
          ? Boolean(target.value)
          : validationForm.title,
    })
  }

  const handleInputSlug = ({
    target: { value },
  }: {
    target: { value: string }
  }) => {
    const slug = generateSlug(value)
    handleTutorialChange({ ...tutorial, slug })
  }

  const handleSlugInputBlur = () => {
    const slugSingleDashes = tutorial.slug.replace(/-{1,}/g, '-')
    handleTutorialChange({ ...tutorial, slug: slugSingleDashes })
    showNotificationRequired('slug')
  }

  const handleChangeType = ({ target }: { target: { value: string } }) => {
    handleTutorialChange({ ...tutorial, type: target.value })
    handleValidationFormChange({
      ...validationForm,
      type: Boolean(target.value),
    })
  }

  const handleChangeDevice = ({ target }: { target: HTMLSelectElement }) => {
    const productId = renderProducts.find(
      (item) =>
        target.selectedOptions[0].getAttribute('data-set') === item.product.id,
    )

    if (productId && productId.product.id) {
      const newTutorial = {
        ...tutorial,
        productId: productId.product.id,
      }
      handleTutorialChange(newTutorial)
    }
    handleValidationFormChange({
      ...validationForm,
      device: Boolean(
        renderProducts.find(
          (item) =>
            target.selectedOptions[0].getAttribute('data-set')
            === item.product.id,
        )?.product.id,
      ),
    })
  }

  return (
    <Container p={0} m={0} maxW="none">
      <LanguageSelector
        language={language || languages[0]}
        setLanguage={handleLanguageChange}
      />
      <Flex flexDir="column" pt={5} gap={4}>
        <CustomInput
          value={
            tutorial.translations.length && language
              ? tutorial.translations.find(
                (item) => item.languageId === language.id,
              )!.value.title || ''
              : ''
          }
          headingText="Title"
          placeholder="Enter text"
          onChange={handleInputTitle}
          isRequired={isRequired.title}
          onBlur={() => {
            autofillSlug()
            showNotificationRequired('title')
          }}
        />
        <CustomInput
          value={tutorial.slug}
          headingText="Slug"
          placeholder="Enter text"
          onChange={handleInputSlug}
          isRequired={isRequired.slug}
          onBlur={handleSlugInputBlur}
        />
        <Flex gap={10} justify="space-between" w="full">
          <Box width="full">
            <Heading as="h3" variant="title">
              Tutorial Type
              {isRequired.type.isRequiredChild && (
                <RequiredMark isRemind={isRequired.type.isNotification} />
              )}
            </Heading>
            <Select
              onBlur={() => showNotificationRequired('type')}
              color="black"
              h={14}
              fontSize="md"
              cursor="pointer"
              placeholder="Select type"
              value={tutorial.type}
              onChange={handleChangeType}
              iconSize="16"
              icon={(
                <Image
                  transform="rotate(180deg)"
                  src="/assets/images/arrow-down.png"
                />
              )}
            >
              {TYPE.map((item) => (
                <option key={item.id}>{item.name}</option>
              ))}
            </Select>
          </Box>
          <Box>
            <Flex justify="space-between" align="center" pb={2}>
              <Heading as="h3" variant="title" pb={0}>
                Category
                {(isRequired.categoryIds.isRequiredChild
                  || isRequired.categoryIds.isNotification) && (
                  <RequiredMark
                    isRemind={isRequired.categoryIds.isNotification}
                  />
                )}
              </Heading>
              <Flex
                bgColor="blue.500"
                _hover={{
                  filter: 'grayscale(41%) saturate(71%)',
                  _disabled: { filter: 'saturate(0%)' },
                }}
                borderRadius={2}
                px={2}
                py={0.5}
                w={32}
                h={4}
                color="white"
                justify="space-between"
                align="center"
                onClick={onOpen}
                cursor="pointer"
              >
                <Image src="/assets/images/add.png" boxSize={4} />
                <Text fontSize="xs" fontWeight="700">
                  Create Category
                </Text>
              </Flex>
              <CreateCategory
                onClose={onClose}
                inputCategory={inputCategory}
                setInputCategory={setInputCategory}
                addCategory={addCategory}
                isDisable={isDisableCreateBtn}
                languages={languages}
                isOpen={isOpen}
              />
            </Flex>
            <Box w={80} h={14} mb={2} display="flex" alignItems="flex-start">
              <DeleteDeviceModal
                isOpen={deleteModalIsOpen}
                onClose={onDeleteModalClose}
                title="Delete Category ?"
                message={`You are about to delete "${selectedCategory.name}"`}
                callback={removeCategory}
                disabled={isDeleteCategoryLoading}
              />
              {categories.length <= 1 ? (
                <LocalLoader />
              ) : (
                <Container
                  onFocus={() => setCategoryList(true)}
                  onBlur={() => showNotificationRequired('categoryIds')}
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
                        && item.name
                          .toLowerCase()
                          .includes(inputSearch.toLowerCase())
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
                              onChange={() => handleCheckCategory(item.id)}
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
              )}
            </Box>
            <Flex minH={9} maxW={96} flexWrap="wrap">
              {categories
                && categories.map(
                  (item) =>
                    item.checked
                    && item.language.id === language?.id && (
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
          </Box>
        </Flex>
        <Box width="full" mt="-10">
          <Heading as="h3" variant="title">
            Select Device
            {isRequired.productId.isRequiredChild && (
              <RequiredMark isRemind={isRequired.productId.isNotification} />
            )}
          </Heading>
          <Select
            onBlur={() => showNotificationRequired('productId')}
            color="black"
            h={14}
            css={{ paddingRight: 18 }}
            fontSize="md"
            cursor="pointer"
            placeholder="Select device"
            value={
              renderProducts
                ? renderProducts.find(
                  (item) => tutorial.productId === item.product.id,
                )?.product.name
                : ''
            }
            onChange={handleChangeDevice}
            iconSize="16"
            icon={(
              <Image
                transform="rotate(180deg)"
                boxSize={4}
                src="/assets/images/arrow-down.png"
              />
            )}
          >
            {renderProducts
              && renderProducts.map((item) => (
                <option data-set={item.product.id} key={item.id}>
                  {item.product.name}
                </option>
              ))}
          </Select>
        </Box>
        <CustomSelect
          headingText="Select Customer"
          isRequired={isRequired.customerIds}
          text="Select Customer"
          list={customers}
          changeList={handleCustomersChange}
          zIndex={7}
          onBlur={() => showNotificationRequired('customerIds')}
        />
      </Flex>
    </Container>
  )
}
