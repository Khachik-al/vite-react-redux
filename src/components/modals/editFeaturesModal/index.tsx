import { useEffect, useState } from 'react'
import {
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { TechnicalSpecsField } from './technicalSpecsField'
import { useNotifications } from '../../../hooks/useNotifications'
import {
  fetchFeaturesData,
  getFeaturesData,
} from '../../../services/api/feature.service'
import {
  Feature,
  FeaturePayload,
  Features,
  FeatureType,
} from '../../../interfaces/feature.interface'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { getLanguages } from '../../../redux/slices/products'
import { LocalLoader } from '../../localLoader'

const FEATURES: { title: string; type: FeatureType }[] = [
  {
    title: 'Features',
    type: 'feature',
  },
  {
    title: 'Technical Specs',
    type: 'tech_spec',
  },
  {
    title: 'Accessories',
    type: 'accessory',
  },
]

export const EditFeaturesModal = ({
  isOpen,
  onClose,
  productId,
}: {
  isOpen: boolean
  onClose: () => void
  productId: string
}) => {
  const [featureType, setFeatureType] = useState<FeatureType>('feature')
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const [language, setLanguage] = useState({
    name: 'English',
    id: '314a38d8-0fbc-4613-b579-62315cfb645c',
  })
  const [features, setFeatures] = useState<Features>({
    feature: [
      {
        id: '',
        name: '',
        value: '',
        language: { id: '', name: '' },
      },
    ],
    tech_spec: [
      {
        id: '',
        name: '',
        value: '',
        language: { id: '', name: '' },
      },
    ],
    accessory: [
      {
        id: '',
        name: '',
        value: '',
        language: { id: '', name: '' },
      },
    ],
  })

  const [newFeatures, setNewFeatures] = useState<Features>({
    feature: [],
    tech_spec: [],
    accessory: [],
  })
  const {
    auth: { token },
    products: { languages },
  } = useAppSelector((state) => state)

  const dispatch = useAppDispatch()

  const getFeatures = async () => {
    try {
      const res: any = await getFeaturesData({
        productId,
        languageId: language.id,
        token,
      })()
      const { data } = await res.json()
      setFeatures({
        accessory: data?.accessories,
        feature: data?.features,
        tech_spec: data?.techSpecs,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getLanguageId = (name = language.name) => languages.find((item) => item.name === name)!

  const onHandleChangeValue = ({
    id,
    type,
    value,
    name,
  }: {
    id: string
    type: FeatureType
    value?: string
    name?: string
  }) => {
    setFeatures((prev) => ({
      ...prev,
      [type]: prev[type].map((item: Feature) => {
        if (item.id === id) {
          if (type === 'tech_spec' && item.id === id) {
            return {
              ...item,
              name:
                item.language.id === getLanguageId()?.id ? name : item.name,
              value:
                item.language.id === getLanguageId()?.id ? value : item.value,
              changed: true,
            }
          }
          return {
            ...item,
            value:
              item.language.id === getLanguageId()?.id ? value : item.value,
            changed: true,
          }
        }
        return item
      }),
    }))
    setNewFeatures((prev) => ({
      ...prev,
      [type]: prev[type].map((item: Feature) => {
        if (item.id === id) {
          if (type === 'tech_spec' && item.id === id) {
            return {
              ...item,
              name:
                item.language.id === getLanguageId()?.id ? name : item.name,
              value:
                item.language.id === getLanguageId()?.id ? value : item.value,
            }
          }
          return {
            ...item,
            value:
              item.language.id === getLanguageId()?.id ? value : item.value,
          }
        }
        return item
      }),
    }))
  }

  const addFeature = (type: FeatureType) => {
    setNewFeatures((prev) => ({
      ...prev,
      [type]: [
        ...prev[type], {
          id: Math.random(),
          name: '',
          language: {
            id: language.id,
            name: language.name,
          },
          value: '',
        },
      ],
    }))
  }

  const removeFeature = async ({
    type,
    id,
  }: {
    type: FeatureType
    id: string
  }) => {
    try {
      setNewFeatures((prev) => ({
        ...prev,
        [type]: prev[type].filter((item: Feature) => item.id !== id),
      }))
      setFeatures((prev) => ({
        ...prev,
        [type]: prev[type].filter((item: Feature) => item.id !== id),
      }))
      if (typeof id === 'string') {
        const res: any = await fetchFeaturesData({
          method: 'delete',
          token,
          body: {
            featureType: type,
            featureId: `${id}`,
          },
        })()
        const { message } = await res.json()
        showSuccessMessage(message)
      }
    } catch (error) {
      console.log(error)
      showErrorMessage('Something wrong')
    }
  }

  const featureInput = () => {
    if (
      featureType === 'feature'
      && (features.feature || newFeatures.feature)
    ) {
      return [...features.feature, ...newFeatures.feature].map((item) => {
        if (item.language.id === language.id) {
          return (
            <InputGroup key={item.id} width={80}>
              <Input
                value={item.value}
                onChange={({ target }) =>
                  onHandleChangeValue({
                    id: item.id,
                    type: 'feature',
                    value: target.value,
                    name: '',
                  })}
              />
              <InputRightElement
                cursor="pointer"
                onClick={() => removeFeature({ type: 'feature', id: item.id })}
              >
                <Image src="assets/images/close.svg" />
              </InputRightElement>
            </InputGroup>
          )
        }
        return null
      })
    }
    if (
      featureType === 'accessory'
      && (features.accessory || newFeatures.accessory)
    ) {
      return [...features.accessory, ...newFeatures.accessory].map((item) => {
        if (item.language.id === getLanguageId()?.id) {
          return (
            <InputGroup key={item.id} width={80}>
              <Input
                value={item.value}
                onChange={({ target }) =>
                  onHandleChangeValue({
                    id: item.id,
                    type: 'accessory',
                    value: target.value,
                    name: '',
                  })}
              />
              <InputRightElement
                cursor="pointer"
                onClick={() =>
                  removeFeature({ type: 'accessory', id: item.id })}
              >
                <Image src="assets/images/close.svg" />
              </InputRightElement>
            </InputGroup>
          )
        }
        return null
      })
    }
    if (
      featureType === 'tech_spec'
      && (features.tech_spec || newFeatures.tech_spec)
    ) {
      return [...features.tech_spec, ...newFeatures.tech_spec].map((item) => {
        if (item.language.id === getLanguageId()?.id) {
          return (
            <TechnicalSpecsField
              key={item.id}
              specsValue={item.name}
              value={item.value}
              setValue={onHandleChangeValue}
              removeFeature={removeFeature}
              id={item.id}
            />
          )
        }
        return null
      })
    }
    return null
  }

  const saveFeatures = () => {
    try {
      FEATURES.forEach(({ type }) => {
        if (newFeatures[type].length) {
          newFeatures[type].forEach(async (el: Feature) => {
            if (!(el.value || el.name)) return
            const body: FeaturePayload = {
              featureType: type,
              name: el.name || '',
              languageId: el.language.id,
              parentProductId: productId,
              value: el.value,
            }
            const res: any = await fetchFeaturesData({
              method: 'post',
              token,
              body,
            })()
            const { data } = await res.json()
            setFeatures((prev) => ({
              ...prev,
              [type]: [
                ...prev[type],
                {
                  id: data.id,
                  value: data.value,
                  name: data.name,
                  product: data.product.id,
                  language: {
                    id: data.language.id,
                    name: languages.find((item) => item.id === data.language.id)!
                      .name,
                  },
                },
              ],
            }))
          })
        }
        features[type].forEach((el: Feature) => {
          if (el.changed === undefined) return
          if (el.value || el.name) {
            const body: FeaturePayload = {
              id: el.id,
              featureType: type,
              name: el.name || '',
              languageId: el.language.id,
              parentProductId: productId,
              value: el.value,
            }
            fetchFeaturesData({
              method: 'PATCH',
              token,
              body,
            })()
          }
        })
      })
      setNewFeatures({
        feature: [],
        tech_spec: [],
        accessory: [],
      })
      showSuccessMessage('The features were successfully saved')
    } catch (error) {
      console.log(error)
      showSuccessMessage('Something Wrong!')
    }
  }

  const onHandleClickCancel = () => {
    setNewFeatures({
      feature: [],
      tech_spec: [],
      accessory: [],
    })
    onClose()
  }

  useEffect(() => {
    getFeatures()
  }, [language])

  useEffect(() => {
    dispatch(getLanguages())
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bgColor="#2D343680" backdropFilter="blur(10px)" />
      <ModalContent p={6} minW="3xl" h="3xl" overflow="hidden">
        <ModalHeader p={0} mb={8}>
          <Heading fontSize={18} fontWeight={600}>
            Edit Features
          </Heading>
        </ModalHeader>
        <ModalBody p={0}>
          <Container maxW="auto">
            <Flex
              flexDir="column"
              py={4}
              justifyContent="space-between"
              pos="relative"
            >
              <Heading as="h2" fontSize="md" pb="4">
                Feature Type
              </Heading>
              <Flex
                bgColor="blue.50"
                borderRadius={50}
                w="sm"
                h={12}
                gap={3}
                p={1}
                justifyContent="space-between"
              >
                {FEATURES.map((item) => (
                  <Button
                    variant={
                      item.type === featureType
                        ? 'primary_button'
                        : 'reset_style_button'
                    }
                    onClick={() => setFeatureType(item.type)}
                    key={item.type}
                  >
                    {item.title}
                  </Button>
                ))}
              </Flex>
              <Button
                onClick={() => addFeature(featureType)}
                pos="absolute"
                right={0}
                py={3}
                px={6}
              >
                <Image src="assets/images/add.svg" alt="add" />
                {`Add ${FEATURES.find((item) => item.type === featureType)?.title
                }`}
              </Button>
            </Flex>
            <Flex flexDir="column">
              <Heading as="h2" fontSize="md" pb="4">
                Language
              </Heading>
              {languages.length ? (
                <Flex
                  bgColor="blue.50"
                  borderRadius={50}
                  w="fit-content"
                  h={12}
                  p={1}
                  justifyContent="space-between"
                >
                  {languages.map((item) => (
                    <Button
                      variant={
                        item.name === language.name
                          ? 'primary_button'
                          : 'reset_style_button'
                      }
                      onClick={() => setLanguage(item)}
                      key={item.name}
                    >
                      {item.name}
                    </Button>
                  ))}
                </Flex>
              ) : (
                <LocalLoader />
              )}
            </Flex>
          </Container>
          <Container maxW="auto" pt={30} pb={30} h={400} overflow="auto">
            <Flex gap={5} flexWrap="wrap">
              {features && featureInput()}
            </Flex>
          </Container>
        </ModalBody>
        <ModalFooter p={0} mt={8}>
          <Flex>
            <Button
              variant="outlined_button"
              borderColor="gray.200"
              onClick={onHandleClickCancel}
            >
              Cancel
            </Button>
            <Button onClick={saveFeatures} variant="button_large">
              Save
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
