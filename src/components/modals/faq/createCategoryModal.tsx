import {
  Button, Flex, Input, Modal,
  ModalBody, ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Text,
} from '@chakra-ui/react'
import {
  ChangeEvent, FormEvent, useState,
} from 'react'
import { createCategory, getParentCategories } from '../../../redux/slices/faq'
import { useAppDispatch } from '../../../redux/hooks'
import { useNotifications } from '../../../hooks/useNotifications'
import { Language } from '../../../interfaces/features.interface'
import { TranslationBody } from '../../../interfaces/faq.interface'

type Props = {
  onClose: () => void
  isOpen: boolean
  languageId: string
  languages: Language[]
  requiredLanguage: Language
}

export const CreateCategoryModal = (
  {
    onClose, isOpen, languageId, languages, requiredLanguage,
  }: Props,
) => {
  const dispatch = useAppDispatch()
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const [translations, setTranslations] = useState<TranslationBody[]>([])
  const [childTranslations, setChildTranslations] = useState<TranslationBody[]>([])
  const [inputState, setInputState] = useState({
    category: '',
    childCategory: '',
  })

  const handleClose = () => {
    setInputState({
      category: '',
      childCategory: '',
    })
    setTranslations([])
    setChildTranslations([])
    onClose()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputState({
      ...inputState,
      [e.target.name]: e.target.value,
    })
  }

  const handleTranslations = (e: ChangeEvent<HTMLInputElement>) => {
    if (translations.find((tr) => tr.languageId === e.target.name)) {
      const filteredTranslations = translations.filter(
        (tr) => tr.languageId !== e.target.name,
      )
      setTranslations([
        ...filteredTranslations,
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

  const handleChildTranslations = (e: ChangeEvent<HTMLInputElement>) => {
    if (childTranslations.find((tr) => tr.languageId === e.target.name)) {
      const filteredChildren = childTranslations.filter((tr) => tr.languageId !== e.target.name)
      setChildTranslations([
        ...filteredChildren,
        {
          languageId: e.target.name,
          name: e.target.value,
        },
      ])
    } else {
      setChildTranslations([
        ...childTranslations,
        {
          languageId: e.target.name,
          name: e.target.value,
        },
      ])
    }
  }

  const checkValidation = (): boolean => {
    let res = true

    if (
      (inputState.category && !inputState.childCategory)
      || (inputState.childCategory && !inputState.category)
    ) {
      res = false
    }

    const filteredTranslations = translations.filter(
      (tr) => tr.name,
    )
    const filteredChilds = childTranslations.filter(
      (tr) => tr.name,
    )

    if (filteredTranslations.length !== filteredChilds.length) {
      res = false
    }

    filteredTranslations.forEach((tr) => {
      const child = filteredChilds.find(
        (ctr) => ctr.languageId === tr.languageId,
      )
      if (
        !child
          || (!tr.name && child.name)
          || (!child.name && tr.name)
      ) {
        res = false
      }
    })

    return res
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!checkValidation()) {
      showErrorMessage('Parent/Child pairs are required')
      return
    }

    const reqBody = {
      categoryName: inputState.category,
      childNames: [{
        languageId,
        name: inputState.childCategory,
        translations: childTranslations.filter((ctr) => ctr.name),
      }],
      translations: translations.filter((tr) => tr.name),
      languageId,
    }

    const resultAction = await dispatch(createCategory(reqBody))

    if (createCategory.fulfilled.match(resultAction)) {
      showSuccessMessage('FAQ successfully added')
    }
    if (createCategory.rejected.match(resultAction)) {
      showErrorMessage('Could not add FAQ')
    }

    dispatch(getParentCategories())
    handleClose()
  }

  return (
    <Modal onClose={handleClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent maxW="none" w="fit-content">
        <form onSubmit={handleSubmit}>
          <ModalHeader>Create a category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mb={4} gap={8}>
              <Flex direction="column">
                <Text mb={2} fontWeight={600}>
                  {requiredLanguage.name}
                  {' '}
                  Parent Category Title
                </Text>
                <Input
                  minW={420}
                  placeholder="Name your category"
                  name="category"
                  onChange={handleInputChange}
                />
              </Flex>
              <Flex direction="column">
                <Text
                  mb={2}
                  fontWeight={600}
                >
                  {requiredLanguage.name}
                  {' '}
                  Child Category Title
                </Text>
                <Input
                  minW={420}
                  placeholder="Name your category"
                  name="childCategory"
                  onChange={handleInputChange}
                />
              </Flex>
            </Flex>
            {
              languages.filter(
                (l) => l.id !== requiredLanguage.id,
              ).map((lang) => (
                <Flex key={lang.id} mb={4} gap={8}>
                  <Flex direction="column">
                    <Text mb={2} fontWeight={600}>
                      {lang.name}
                      {' '}
                      Parent Category Title
                    </Text>
                    <Input
                      minW={420}
                      placeholder="Name your category"
                      onChange={handleTranslations}
                      name={lang.id}
                    />
                  </Flex>
                  <Flex direction="column">
                    <Text
                      mb={2}
                      fontWeight={600}
                    >
                      {lang.name}
                      {' '}
                      Child Category Title
                    </Text>
                    <Input
                      minW={420}
                      placeholder="Name your category"
                      onChange={handleChildTranslations}
                      name={lang.id}
                    />
                  </Flex>
                </Flex>
              ))
            }
          </ModalBody>
          <ModalFooter pt={0}>
            <Flex gap={4}>
              <Button
                variant="secondary_button"
                borderColor="gray.100"
                color="gray.100"
                py={4}
                px={8}
                onClick={handleClose}
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
