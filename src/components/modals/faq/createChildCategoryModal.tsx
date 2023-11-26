import {
  Button, Modal,
  ModalBody, ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader, Box,
  ModalOverlay, Flex, Text, Input, Select,
} from '@chakra-ui/react'
import {
  ChangeEvent, FormEvent, useState,
} from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { createCategory } from '../../../redux/slices/faq'
import { useNotifications } from '../../../hooks/useNotifications'
import { Language } from '../../../interfaces/features.interface'
import { TranslationBody } from '../../../interfaces/faq.interface'

type Props = {
  onClose: () => void
  isOpen: boolean
  requiredLanguage: Language
  languages: Language[]
}

export const CreateChildCategoryModal = (
  {
    onClose, isOpen, requiredLanguage, languages,
  }: Props,
) => {
  const dispatch = useAppDispatch()
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const { parentCategories } = useAppSelector((state) => state.faq)
  const [inputState, setInputState] = useState({
    category: '',
    childCategory: '',
  })
  const [translations, setTranslations] = useState<TranslationBody[]>([])

  const handleTranslations = (e: ChangeEvent<HTMLInputElement>) => {
    if (translations.find((tr) => tr.languageId === e.target.name)) {
      const clone = translations.filter((tr) => tr.languageId !== e.target.name)
      setTranslations([
        ...clone,
        {
          languageId: e.target.name,
          name: e.target.value,
        },
      ])
    } else {
      setTranslations([
        ...translations,
        {
          languageId: e.target.name,
          name: e.target.value,
        },
      ])
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputState({
      ...inputState,
      [e.target.name]: e.target.value,
    })
  }

  const checkValidation = () => {
    let res = true

    if (!inputState.childCategory || !inputState.category) {
      res = false
    }

    return res
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!checkValidation()) {
      showErrorMessage('Parent category and English title are required')
      return
    }

    const reqBody = {
      categoryId: inputState.category,
      childNames: [{
        languageId: requiredLanguage.id,
        name: inputState.childCategory,
        translations,
      }],
      languageId: requiredLanguage.id,
    }

    const resultAction = await dispatch(createCategory(reqBody))

    if (createCategory.fulfilled.match(resultAction)) {
      showSuccessMessage('FAQ successfully added')
    }

    if (createCategory.rejected.match(resultAction)) {
      showErrorMessage('Could not add FAQ')
    }

    setInputState({
      category: '',
      childCategory: '',
    })
    setTranslations([])
    onClose()
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a child category</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Box>
              <Text
                fontWeight={600}
                mb={2}
              >
                Select Parent Category
              </Text>
              <Select
                name="category"
                value={inputState.category}
                onChange={handleInputChange}
              >
                <option value="">
                  Select value
                </option>
                {
                  parentCategories.map((parentCategory) => (
                    <option
                      key={parentCategory.id}
                      value={parentCategory.id}
                    >
                      {parentCategory.name}
                    </option>
                  ))
                }
              </Select>
            </Box>
            <Box my={8}>
              <Flex mb={2}>
                <Text
                  fontWeight={600}
                  fontSize={14}
                >
                  {requiredLanguage.name}
                  {' '}
                  Child Category Title
                </Text>
                <Text color="blue.500" ml={1}>*</Text>
              </Flex>
              <Input
                placeholder="Name your category"
                name="childCategory"
                onChange={handleInputChange}
                value={inputState.childCategory}
                _placeholder={{
                  fontSize: 16,
                }}
              />
            </Box>
            <>
              {
                languages.filter(
                  (l) => l.id !== requiredLanguage.id,
                ).map((lang) => (
                  <Box key={lang.id} my={8}>
                    <Flex mb={2}>
                      <Text
                        fontWeight={600}
                        fontSize={14}
                      >
                        {lang.name}
                        {' '}
                        Child Category Title
                      </Text>
                      <Text color="blue.500" ml={1}>*</Text>
                    </Flex>
                    <Input
                      placeholder="Name your category"
                      name={lang.id}
                      onChange={handleTranslations}
                      _placeholder={{
                        fontSize: 16,
                      }}
                    />
                  </Box>
                ))
              }
            </>
          </ModalBody>
          <ModalFooter pt={0}>
            <Flex gap={4}>
              <Button
                variant="secondary_button"
                borderColor="gray.100"
                color="gray.100"
                py={4}
                px={8}
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                py={4}
                px={8}
                type="submit"
              >
                Create
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
