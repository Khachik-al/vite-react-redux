import {
  Button,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import {
  ChangeEvent, useEffect, useMemo, useRef, useState,
} from 'react'
import { useHandleImageUpload } from '../../../hooks/useHandleImageUpload'
import { useNotifications } from '../../../hooks/useNotifications'
import type {
  DeviceList,
  ResponseType,
  SelectedFile,
} from '../../../interfaces/data.interface'
import type { Language } from '../../../interfaces/features.interface'
import type {
  Category,
  CategoryIds,
  Customer,
  PostTutorial,
  Step,
  Translations,
  Tutorial,
  ValidationForm,
  HtmlSteps,
} from '../../../interfaces/tutorials.interface'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { getDevices, getLanguages } from '../../../redux/slices/products'
import {
  getCategories,
  getCustomers,
  getProductById,
  postAsset,
  postStepTutorial,
  postTutorial,
} from '../../../services/api'
import { normalizeSpaces } from '../../../utils/helper'
import { FinishTutorial } from './finishTutorial'
import { HtmlTutorial } from './htmlTutorial'
import { InteractiveTutorial } from './interactiveTutorial'
import { FinishHtmlTutorial } from './finishHtmlTutorial'
import { TutorialsInfo } from './tutorialsInfo'

type ValidationObj = {
  [key: string]: {
    [key: string]: boolean
  }
}

type ValidationField =
  | 'title'
  | 'categoryIds'
  | 'slug'
  | 'productId'
  | 'type'
  | 'customerIds'

export const NewTutorials = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const DEFAULT_LANG = import.meta.env.VITE_DEFAULT_LANGUAGE

  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)
  const { languages } = useAppSelector((state) => state.products)
  const {
    devices: { deviceList: products },
  } = useAppSelector((state) => state.products)

  const [language, setLanguage] = useState<Language>({
    name: 'English',
    id: '',
    code: '',
  })
  const [step, setStep] = useState(0)
  const [categories, setCategories] = useState<Category[]>([
    {
      name: '',
      id: '',
      language,
      checked: false,
    },
  ])
  const [stepsTutorial, setStepsTutorial] = useState<Step[]>([])
  const [stepTutorial, setStepTutorial] = useState(0)
  const [htmlSteps, setHtmlSteps] = useState<HtmlSteps[]>([])
  const [validationForm, setValidationForm] = useState<ValidationForm>({
    slug: false,
    type: false,
    title: false,
    device: false,
    customer: false,
  })
  const [validationObj, setValidationObj] = useState<ValidationObj>({
    '': {
      title: false,
      category: false,
    },
  })
  const [customers, setCustomers] = useState<Customer[]>([])
  const [tutorial, setTutorial] = useState<Tutorial>({
    id: '',
    faceplate: {
      id: '',
      is_behind: false,
      portrait_image: '',
      portrait_x: 0,
      portrait_y: 0,
      portrait_width: 0,
      portrait_height: 0,
      landscape_image: '',
      landscape_x: 0,
      landscape_y: 0,
      landscape_width: 0,
      landscape_height: 0,
    },
    productId: '',
    type: '',
    customerIds: [],
    categoryIds: [],
    isPublic: true,
    title: '',
    slug: '',
    translations: [],
  })
  const [isTutorialStepNotification, setIsTutorialStepNotification] = useState(false)
  const [isInitialization, setIsInitialization] = useState(false)
  const [isPostTutorialLoading, setIsPostTutorialLoading] = useState(false)
  const [isRequired, setIsRequired] = useState<{
    [key: string]: {
      isRequiredChild: boolean
      isNotification: boolean
    }
  }>({
    title: {
      isRequiredChild: true,
      isNotification: false,
    },
    slug: {
      isRequiredChild: true,
      isNotification: false,
    },
    type: {
      isRequiredChild: true,
      isNotification: false,
    },
    productId: {
      isRequiredChild: true,
      isNotification: false,
    },
    customerIds: {
      isRequiredChild: true,
      isNotification: false,
    },
    categoryIds: {
      isRequiredChild: true,
      isNotification: false,
    },
  })
  const {
    isOpen: isOpenImage,
    onOpen: onOpenImage,
    onClose: onCloseImage,
  } = useDisclosure()

  const isValidRef = useRef(false)
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

  const isValidationPassed = (() => {
    if (tutorial.type === 'HTML5' && step === 1 && htmlSteps.length) return true
    if (!languages.length) return false
    const notValidItem = Object.values(validationObj).find(
      (item: { [key: string]: boolean }) => item.title !== item.category,
    )

    if (!validationObj[requiredLanguage.id]) return false
    const requiredLanguageCheck = validationObj[requiredLanguage.id].category
      && validationObj[requiredLanguage.id].title
    const mainForm = Object.values(validationForm).find(
      (item) => item === false,
    )

    if (
      (step === 0
        && (notValidItem || !requiredLanguageCheck || mainForm !== undefined))
      || (step === 1 && !stepsTutorial.length)
      || (step === 2 && isPostTutorialLoading)
    ) {
      return false
    }
    return true
  })()

  const showNotificationRequired = (name: string) => {
    if (!isValidRef.current) return
    const requiredLanguageCheck = language?.name === DEFAULT_LANG
    const key = name as ValidationField

    const t = (value: string) => {
      switch (value) {
        case 'type':
        case 'slug':
        case 'productId':
          return !tutorial[key]
        case 'customerIds':
          return !tutorial.customerIds.length
        case 'categoryIds':
          return Boolean(
            !categories?.find(
              (item) => item.language.id === language.id && item.checked,
            ),
          )
        case 'title':
          return Boolean(
            !tutorial.translations.find(
              (item) => item.languageId === language.id,
            )?.value.title,
          )
        default:
          return false
      }
    }

    if (requiredLanguageCheck || (name !== 'title' && name !== 'categoryIds')) {
      const showRequiredMark = ['name', 'categoryId'].includes(name)
      setIsRequired((prev) => ({
        ...prev,
        [name]: {
          isRequiredChild: prev[key].isRequiredChild || showRequiredMark,
          isNotification: t(name),
        },
      }))
    } else {
      const notValid = validationObj[language.id].title !== validationObj[language.id].category
      setIsRequired((prev) => ({
        ...prev,
        title: {
          isRequiredChild: notValid ? t('title') : false,
          isNotification: notValid ? t('title') : false,
        },
        categoryIds: {
          isRequiredChild: notValid ? t('categoryIds') : false,
          isNotification: notValid ? t('categoryIds') : false,
        },
      }))
    }
  }

  const handleHtmlUrlChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setHtmlSteps((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...prev[index],
            url: { src: e.target.value },
          }
        }
        return item
      }))
  }

  const resetModalForm = ({
    customersMock,
    categoriesMock,
    languagesMock,
  }: {
    customersMock: Customer[]
    categoriesMock: Category[]
    languagesMock: Language[]
  }) => {
    setTutorial((prev) => ({
      ...prev,
      customerIds: [''],
      productId: '',
      type: '',
      title: '',
      slug: '',
      translations: languagesMock.map((item: Language) => ({
        languageId: item.id,
        value: { title: '' },
      })),
    }))
    setCategories(
      categoriesMock.map((item: Category) => ({ ...item, checked: false })),
    )
    setCustomers(
      customersMock.map((item: Customer) => ({ ...item, checked: false })),
    )
  }

  const onCloseModal = () => {
    setIsInitialization(false)
    resetModalForm({
      customersMock: customers,
      categoriesMock: categories,
      languagesMock: languages,
    })
    onClose()
  }

  const createStepOnImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const base64 = await useHandleImageUpload(files)

    const newStep = base64.map(
      (item: string, index: number): Step => ({
        isSubstep: false,
        isAnimatedStep: false,
        order: stepsTutorial.length + index,
        orientation: 'portrait',
        delay: 400,
        action: {
          type: 'automate',
          x: 0,
          y: 0,
          isOnScreen: false,
        },
        text: '',
        filePath: {
          file: files[index],
          fileName: files[index].name,
          fileImg: String(item),
          id: String(Math.random()),
        },
        translations: languages.map((i) => ({
          value: { text: '' },
          languageId: i.id,
        })),
      }),
    )

    if (!base64) return
    setStepsTutorial([...stepsTutorial, ...newStep])
  }

  const createTutorial = async (steps: HtmlSteps[] | Step[]) => {
    try {
      setIsPostTutorialLoading(true)
      const tmp: Tutorial = { ...tutorial }
      delete tmp.id
      delete tmp.faceplate
      const bodyTutorial: PostTutorial = { ...tmp, categoryIds: [] }
      bodyTutorial.categoryIds = tutorial.categoryIds.map((item) => item.id)

      const res = (await postTutorial({
        token,
        body: bodyTutorial,
      })()) as ResponseType<Tutorial>
      const { data, message, error } = await res.json()
      if (error) {
        setIsPostTutorialLoading(false)
        return showErrorMessage(`Something wrong: ${message}`)
      }
      if (data && data.id) {
        showSuccessMessage(message)
        const uploadFilesStep = Promise.all(
          steps.map(async (tutorialStep) => {
            const item: any = { ...tutorialStep }

            if ('url' in item && item.url.src) {
              const filePath = item.url.src
              item.isAnimatedStep = false
              delete item.url
              delete item.zip
              return {
                ...item,
                filePath,
              }
            }

            const file = 'filePath' in item ? item.filePath.file : item.zip.data
            const filename = 'filePath' in item ? item.filePath.fileName : item.zip.fileName

            const image: SelectedFile = {
              myFile: file,
              filename,
            }
            const url = await postAsset(token, image)

            if ('url' in item) {
              if (item.isSubstep) {
                delete item.text
              }
              delete item.url
              delete item.zip
              item.isAnimatedStep = false
            }

            return {
              ...item,
              filePath: url,
            }
          }),
        )
        const bodyStepsTutorial = await uploadFilesStep
        const resStep = (await postStepTutorial({
          token,
          body: bodyStepsTutorial,
          id: data.id,
        })()) as ResponseType
        const { message: stepsMessage, error: stepsError } = await resStep.json()
        if (stepsError) {
          setIsPostTutorialLoading(false)
          return showErrorMessage(`Something wrong: ${stepsMessage}`)
        }
        showSuccessMessage(stepsMessage)
        onCloseModal()
      }
    } catch (error) {
      showErrorMessage(`Something wrong: ${error}`)
    }
    setStepTutorial(0)
    setHtmlSteps([])
    setIsPostTutorialLoading(false)
    return null
  }

  const getData = async () => {
    const [customersRes, categoriesRes] = (await Promise.all([
      getCustomers({ token })(),
      getCategories({ token })(),
    ])) as [ResponseType<Customer[]>, ResponseType<Category[]>]
    const [{ data }, { data: categoryData }] = await Promise.all([
      customersRes.json(),
      categoriesRes.json(),
    ])

    resetModalForm({
      customersMock: data,
      categoriesMock: categoryData,
      languagesMock: languages,
    })
  }

  const getFaceplate = async () => {
    if (!tutorial.productId) return
    const currentProduct = products.find(
      (item) => item.product.id === tutorial.productId,
    )
    if (currentProduct && currentProduct.id) {
      const res = (await getProductById({
        token,
        id: currentProduct.id,
      })()) as ResponseType<DeviceList>
      const {
        data: {
          product: { faceplate },
        },
      } = await res.json()
      setTutorial((prev: Tutorial) => ({
        ...prev,
        faceplate,
      }))
    }
  }

  const initialization = () => {
    setIsInitialization(true)
    if (requiredLanguage) setLanguage(requiredLanguage)
    setValidationObj((prev: ValidationObj) => {
      const tmp: ValidationObj = {}
      const mockRules = {
        title: false,
        category: false,
      }
      languages.forEach((item: { id: string; name: string }) => {
        tmp[item.id] = { ...mockRules, ...prev[item.id] }
      })
      return tmp
    })
    getData()
  }

  const handleValidationObjChange = ({
    languageId,
    value,
    field,
  }: {
    languageId: string
    value: boolean
    field: keyof ValidationObj
  }) => {
    setValidationObj((prev: ValidationObj) => {
      const tmp = { ...prev }
      if (tmp[languageId]) tmp[languageId][field] = value
      else {
        tmp[languageId] = {}
        tmp[languageId][field] = value
      }
      return tmp
    })
  }

  const handleFileReader = (event: { target: { files: File[] } }) => {
    setHtmlSteps((prev) => [
      ...prev,
      {
        url: { src: '' },
        zip: {
          data: event.target.files[0],
          fileName: event.target.files[0].name,
        },
        isSubstep: false,
        translations: languages.map((item) => ({
          value: { text: '' },
          languageId: item.id,
        })),
        order: prev.length,
        text: '',
      },
    ])
  }

  const handleClickPrevStep = () => {
    if (step > 0) {
      return setStep(step - 1)
    }
    return onCloseModal()
  }

  const handleClickNextStep = () => {
    setTutorial((prev: Tutorial) => ({
      ...prev,
      title: normalizeSpaces(prev.title),
      translations: prev.translations.map((item: Translations) => ({
        ...item,
        value: { title: normalizeSpaces(item.value.title!) },
      })),
    }))
    if (step !== 2) {
      if (!normalizeSpaces(tutorial.title)) return
      setStep(step + 1)
    } else {
      const notValid = stepsTutorial.find(
        (item: Step) => !normalizeSpaces(item.text) && !item.isSubstep,
      )
      setStepsTutorial((prev: Step[]) =>
        prev.map((item: Step) => ({
          ...item,
          text: normalizeSpaces(item.text),
          translations: item.translations.map((i) => ({
            ...i,
            value: { text: normalizeSpaces(i.value.text!) },
          })),
        })))

      if (notValid) {
        setStepTutorial(notValid.order)
        setIsTutorialStepNotification(true)
        setTimeout(() => setIsTutorialStepNotification(false), 2000)
      } else if (tutorial.type === 'Interactive') {
        createTutorial(stepsTutorial)
      } else if (tutorial.type === 'HTML5') {
        createTutorial(htmlSteps)
      }
    }
  }

  const changeValidationForm = () => {
    let isValidation = true
    Object.keys(validationForm).forEach((key: string) => {
      isValidation = isValidation && validationForm[key as keyof ValidationForm]
    })
  }

  const changeFileName = (value: string, index: number) => {
    setHtmlSteps((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...prev[index],
            zip: { ...prev[index].zip, fileName: value },
          }
        }
        return item
      }))
  }

  const removeUploadedImage = (i: number) => {
    setStepsTutorial((prev) =>
      prev
        .filter((_, index) => index !== i)
        .map((item, index) => ({ ...item, order: index })))
  }

  const addNewHtmlStep = (t: 'url' | 'zip') => {
    if (t === 'url') {
      setHtmlSteps((prev) => [
        ...prev,
        {
          url: { src: '' },
          zip: { data: null, fileName: '' },
          isSubstep: false,
          translations: languages.map((item) => ({
            value: { text: '' },
            languageId: item.id,
          })),
          order: prev.length,
          text: '',
        },
      ])
    }
  }

  const removeHtmlStep = (id: number) => {
    setHtmlSteps((prev) => prev.filter((_, index) => index !== id))
  }

  const handleCategoriesChange = (newCategories: Category[]) => {
    setCategories(newCategories)
  }

  const handleCustomersChange = (newCustomers: Customer[]) => {
    setCustomers(newCustomers)
  }

  const handleTutorialChange = (newTutorial: Tutorial) => {
    setTutorial(newTutorial)
  }

  const handleStepsTutorialChange = (newSteps: Step[]) => {
    setStepsTutorial(newSteps)
  }

  const htmlStepsChange = (newSteps: HtmlSteps[]) => {
    setHtmlSteps(newSteps)
  }

  const handleStepTutorialChange = (newStep: number) => {
    setStepTutorial(newStep)
  }

  const handleValidationFormChange = (value: ValidationForm) => {
    setValidationForm(value)
  }

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
  }

  const displayTutorial = () => {
    if (tutorial.type === 'Interactive' && step === 1) {
      return (
        <InteractiveTutorial
          stepsTutorial={stepsTutorial}
          handleStepsTutorialChange={handleStepsTutorialChange}
          createStepOnImageUpload={createStepOnImageUpload}
          removeUploadedImage={removeUploadedImage}
          isOpen={isOpenImage}
          onClose={onCloseImage}
          onOpen={onOpenImage}
        />
      )
    }
    if (tutorial.type === 'HTML5' && step === 1) {
      return (
        <HtmlTutorial
          steps={htmlSteps}
          addNewHtmlStep={addNewHtmlStep}
          removeHtmlStep={removeHtmlStep}
          handleFileReader={handleFileReader}
          changeFileName={changeFileName}
          handleInputChange={handleHtmlUrlChange}
        />
      )
    }

    if (tutorial.type === 'Interactive' && step === 2) {
      return (
        <FinishTutorial
          stepsTutorial={stepsTutorial}
          handleStepsTutorialChange={handleStepsTutorialChange}
          tutorial={tutorial}
          stepTutorial={stepTutorial}
          handleStepTutorialChange={handleStepTutorialChange}
          isTutorialStepNotification={isTutorialStepNotification}
          requiredLanguage={requiredLanguage}
        />
      )
    }

    if (tutorial.type === 'HTML5' && step === 2) {
      return (
        <FinishHtmlTutorial
          stepsTutorial={htmlSteps}
          stepTutorial={stepTutorial}
          handleStepTutorialChange={handleStepTutorialChange}
          requiredLanguage={requiredLanguage}
          handleStepsTutorialChange={htmlStepsChange}
        />
      )
    }

    return (
      <TutorialsInfo
        categories={categories}
        customers={customers}
        tutorial={tutorial}
        language={language}
        isRequired={isRequired}
        validationForm={validationForm}
        handleCategoriesChange={handleCategoriesChange}
        handleCustomersChange={handleCustomersChange}
        showNotificationRequired={showNotificationRequired}
        handleTutorialChange={handleTutorialChange}
        handleValidationFormChange={handleValidationFormChange}
        handleLanguageChange={handleLanguageChange}
        requiredLanguage={requiredLanguage}
      />
    )
  }

  useEffect(() => {
    if (!isInitialization) return
    showNotificationRequired('title')
    showNotificationRequired('categoryIds')
  }, [language])

  useEffect(() => {
    setValidationForm((prev) => ({
      ...prev,
      customer: Boolean(tutorial.customerIds.length),
    }))
    if (isInitialization) {
      showNotificationRequired('customerIds')
    }
  }, [tutorial.customerIds])

  useEffect(() => {
    if (!languages.length) return
    languages.forEach((lang) => {
      const categoryLang = tutorial.categoryIds.filter(
        (item: CategoryIds) => item.languageId === lang.id,
      )
      handleValidationObjChange({
        languageId: lang.id,
        value: Boolean(categoryLang.length),
        field: 'category',
      })
    })
  }, [tutorial.categoryIds])

  useEffect(() => {
    if (isInitialization) {
      showNotificationRequired('categoryIds')
    }
  }, [validationObj])

  useEffect(() => {
    changeValidationForm()
  }, [validationForm])

  useEffect(() => {
    tutorial.translations.forEach((item) => {
      handleValidationObjChange({
        languageId: item.languageId,
        value: Boolean(item.value.title),
        field: 'title',
      })
    })
    if (isInitialization) {
      showNotificationRequired('title')
    }
  }, [tutorial.translations])

  useEffect(() => {
    if (isInitialization) {
      getFaceplate()
      showNotificationRequired('productId')
    }
  }, [tutorial.productId])

  useEffect(() => {
    if (!isOpen) {
      setStep(0)
    }
  }, [isOpen])

  useEffect(() => {
    setStepsTutorial([])
    if (isInitialization) showNotificationRequired('type')
  }, [tutorial.type])

  useEffect(() => {
    dispatch(getLanguages())
    dispatch(getDevices())
  }, [])

  useEffect(() => {
    if (!isInitialization && languages.length) initialization()
  }, [languages])

  useEffect(() => {
    if (categories && language && isInitialization) {
      setTutorial((prev: Tutorial) => ({
        ...prev,
        categoryIds: categories
          .filter((item) => item.checked)
          .map((item) => ({
            id: item.id,
            languageId: item.language.id,
          })),
        customerIds: customers
          .filter((item) => item.checked)
          .map((item) => item.id),
      }))
    }
  }, [categories, customers])

  useEffect(() => {
    setValidationForm((prev: ValidationForm) => ({
      ...prev,
      slug: Boolean(tutorial.slug),
    }))
    if (isInitialization) showNotificationRequired('slug')
  }, [tutorial.slug])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent
        w="100%"
        maxW={['md', 'lg', '2xl', '4xl', '4xl']}
        minW="md"
        p={8}
        h="100%"
        maxH={['2xl', '2xl', '2xl', '3xl', '3xl', '4xl']}
        m={0}
        onClick={() => {
          isValidRef.current = true
        }}
      >
        <ModalHeader p={0}>
          <Heading fontSize="lg" pb={4}>
            Create New Tutorial
          </Heading>
          <Tabs variant="soft-rounded" index={step}>
            <TabList gap={4} height="4px">
              <Tab
                bgColor={step >= 0 ? 'blue.500 !important' : 'gray.50'}
                width={16}
                p={0}
              />
              <Tab
                bgColor={step >= 1 ? 'blue.500 !important' : 'gray.50'}
                width={16}
                p={0}
              />
              <Tab
                bgColor={step >= 2 ? 'blue.500 !important' : 'gray.50'}
                width={16}
                p={0}
              />
            </TabList>
          </Tabs>
          <ModalCloseButton onClick={onCloseModal} />
        </ModalHeader>
        <ModalBody p={3} overflowY="auto">
          <Container p={0} m={0} pt={8} maxW="none">
            {displayTutorial()}
          </Container>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="end" gap={4} p={0} mt={8}>
          {step === 1 && (
            <Button
              onClick={() => createTutorial(stepsTutorial)}
              isDisabled={isPostTutorialLoading || !stepsTutorial.length}
              variant="reset_style_button"
              fontWeight="semibold"
              color="blue.500"
            >
              Finish
            </Button>
          )}
          <Button
            variant="secondary_button"
            px={8}
            py={4}
            onClick={handleClickPrevStep}
          >
            {step > 0 ? 'Back' : 'Cancel'}
          </Button>
          <Button
            isDisabled={!isValidationPassed}
            px={8}
            py={4}
            onClick={handleClickNextStep}
          >
            {step === 2 ? 'Finish' : 'Next Step'}
            {step === 2 && isPostTutorialLoading && (
              <Spinner ml={2} color="white" />
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
