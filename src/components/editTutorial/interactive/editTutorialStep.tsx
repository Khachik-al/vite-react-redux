import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { useHandleImageUpload } from '../../../hooks/useHandleImageUpload'
import { useNotifications } from '../../../hooks/useNotifications'
import {
  DeviceList,
  ResponseType,
  SelectedFile,
} from '../../../interfaces/data.interface'
import { Language } from '../../../interfaces/features.interface'
import {
  Steps,
  StepTranslation,
  Tutorial,
  TutorialsData,
  TypeButton,
} from '../../../interfaces/tutorials.interface'
import { useAppSelector } from '../../../redux/hooks'
import { getProductById, postAsset } from '../../../services/api'
import { LocalLoader } from '../../localLoader'
import {
  IncrementButtons,
  MouseMove,
} from '../../modals/tutorials/finishTutorial'
import { TouchButton } from '../../touchButton/touchButton'

const TYPE: TypeButton[] = [
  {
    name: 'automate',
    text: 'Automate',
  },
  {
    name: 'click',
    text: 'Button',
  },
  {
    name: 'swipe_up',
    text: 'Swipe up',
  },
  {
    name: 'swipe_down',
    text: 'Swipe down',
  },
  {
    name: 'swipe_left',
    text: 'Swipe left',
  },
  {
    name: 'swipe_right',
    text: 'Swipe right',
  },
]

export const EditTutorialStep = ({
  tutorial,
  language,
  setTutorial,
  steps,
  setSteps,
}: {
  tutorial: TutorialsData
  language: Language
  setTutorial: (prev: any) => void
  steps: Steps[]
  setSteps: (prev: any) => void
}) => {
  const [step, setStep] = useState(0)
  const {
    auth: { token },
    products: { languages },
  } = useAppSelector((state) => state)
  const { showErrorMessage } = useNotifications()
  const [mouseMove, setMouseMove] = useState<MouseMove>({
    downX: 0,
    leaveX: 0,
    movingX: 0,
    downY: 0,
    leaveY: 0,
    movingY: 0,
  })

  const getFaceplate = async () => {
    try {
      if (tutorial.id) {
        const res = (await getProductById({
          token,
          id: '0a374a36-4c6d-4874-8b8b-14ce9247b058',
        })()) as ResponseType<DeviceList>
        const { data, error } = await res.json()
        if (!data) {
          showErrorMessage('Product Not Found')
        }
        if (error) {
          showErrorMessage(error.message)
        }
        if (data) {
          setTutorial((prev: Tutorial) => ({
            ...prev,
            faceplate: data.product.faceplate,
          }))
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        showErrorMessage(error.message)
        console.log(error)
      }
    }
  }

  const changeButtonType = (e: ChangeEvent<HTMLSelectElement>) => {
    const t = TYPE.find((i) => e.target.value === i.text)!.name
    const newSteps = steps.map((item, index) => {
      if (index === step) {
        return {
          ...steps[step],
          action: {
            ...steps[step].action,
            type: t,
            isOnScreen: t !== 'automate',
          },
        }
      }
      return item
    })
    setSteps(newSteps)
  }

  const handleChangeDelay = (_valueAsString: string, valueAsNumber: number) => {
    if (Number.isNaN(valueAsNumber) || valueAsNumber < 0) return
    const newSteps = steps.map((item, index) => {
      if (index === step) {
        return {
          ...steps[step],
          delay: valueAsNumber,
        }
      }
      return item
    })
    setSteps(newSteps)
  }

  const handleInputChange = (target: { value: string }, id: string) => {
    const newSteps = steps.map((item, index) => {
      if (index === step) {
        return {
          ...steps[step],
          text:
            language?.name
            === item.translations.find((t) => t.language.id === language.id)
              ?.language.name
              ? target.value
              : steps[step].text,
          translations: [
            ...steps[step].translations.map((t: StepTranslation) => {
              if (id === t.language.id) {
                return {
                  ...t,
                  text: target.value,
                }
              }
              return t
            }),
          ],
        }
      }
      return item
    })
    setSteps(newSteps)
  }

  const onHandleChangeStep = (type: 'dec' | 'inc') =>
    setStep((prev) => {
      if (type === 'dec') {
        return prev - 1
      }
      return prev + 1
    })

  const nextStep = () => {
    if (step + 1 === steps.length) {
      return null
    }
    return setStep((prev) => prev + 1)
  }

  const addNewStep = () => {
    setSteps((prev: Steps[]) => [
      ...prev,
      {
        is_substep: false,
        is_animated_step: false,
        animation: [],
        order: steps.length + 1,
        orientation: 'portrait',
        delay: 400,
        action: {
          id: '',
          type: 'automate',
          x: 0,
          y: 0,
          on_screen: false,
        },
        text: '',
        file_path: steps[step].file_path,
        translations: languages.map((item, index) => ({
          text: '',
          id: `${index}`,
          language: {
            id: item.id,
            name: item.name,
            code: item.code,
          },
        })),
        id: Math.random().toString(),
      } as any,
    ])
  }

  const removeStep = () => {
    const newSteps = steps
      .filter((_, index) => index !== step)
      .map((item, index) => ({ ...item, order: index }))
    setStep((prev) => prev - 1)
    setSteps(newSteps)
  }

  const movingButtonImages = ({ x = 0, y = 0 }: { x: number; y: number }) => {
    if (steps[step] && steps[step].action.type === 'automate') return
    const screenWidth = 181
    const screenHeight = 391
    const clamp = (interval: number, max: number) =>
      Math.max(0, Math.min(interval, max))
    const t = () => {
      switch (steps[step].orientation) {
        case 'portrait':
          return {
            moveX: clamp(x + steps[step].action.x, screenWidth),
            moveY: clamp(y + steps[step].action.y, screenHeight),
          }
        case 'landscape':
          return {
            moveX: clamp(x + steps[step].action.x, screenHeight),
            moveY: clamp(y + steps[step].action.y, screenWidth),
          }
        default:
          return {
            moveX: clamp(x + steps[step].action.x, screenWidth),
            moveY: clamp(y + steps[step].action.y, screenHeight),
          }
      }
    }
    const newSteps = steps.map((item, index) => {
      if (index === step) {
        return {
          ...steps[step],
          action: {
            ...steps[step].action,
            x: t().moveX,
            y: t().moveY,
          },
        }
      }
      return item
    })
    setSteps(newSteps)
  }

  const handleSubstepChange = ({
    target,
    type,
  }: {
    target: { checked: boolean }
    type: 'sub' | 'animated'
  }) => {
    const newSteps = steps.map((item, index) => {
      if (index === step) {
        if (type === 'sub') {
          return {
            ...steps[step],
            is_substep: target.checked,
          }
        }
        if (type === 'animated') {
          return {
            ...steps[step],
            is_animated_step: target.checked,
          }
        }
      }
      return item
    })

    setSteps(newSteps)
  }

  const changeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const base64 = await useHandleImageUpload(files)

    const image: SelectedFile = {
      myFile: files[0],
      filename: files[0].name,
    }
    const url = await postAsset(token, image)

    if (!base64) return
    const newSteps = steps.map((item, index) => {
      if (index === step) {
        return {
          ...steps[step],
          filePath: url,
        }
      }
      return item
    })
    setSteps(newSteps)
  }

  useEffect(() => {
    movingButtonImages({ x: mouseMove.movingX, y: mouseMove.movingY })
  }, [mouseMove.movingX, mouseMove.movingY])

  useEffect(() => {
    setStep(0)
    getFaceplate()
  }, [])

  return (
    <Flex pl={2} overflowX="hidden" flexDirection="row">
      {steps.length ? (
        <>
          <Container>
            <Tabs variant="soft-rounded" index={step} w={72}>
              <Flex justifyContent="space-between">
                <Text fontWeight="bold" color="gray.200">
                  Step
                  {' '}
                  {step + 1}
                  {' '}
                  of
                  {' '}
                  {steps.length}
                </Text>
                <Button onClick={addNewStep} variant="square_button">
                  + Add New Step
                </Button>
              </Flex>
              <TabList gap={4} my={3} height="4px">
                {steps.map((s, index) => (
                  <Tab
                    key={s.id}
                    bgColor={
                      step === index && step >= 0
                        ? 'blue.500 !important'
                        : 'gray.50'
                    }
                    width={16}
                    p={0}
                  />
                ))}
              </TabList>
            </Tabs>
            <Flex flexDir="column">
              <Box>
                <Text fontWeight="bold" mb={3}>
                  Button on LCD = YES
                </Text>
                <IncrementButtons
                  xCoord={steps[step].action.x}
                  yCoord={steps[step].action.y}
                  isDisabled={steps[step].action.type === 'automate'}
                  movingButtonImages={movingButtonImages}
                />
              </Box>
              <Flex flexDir="row" gap={3} mt={5}>
                <Flex flexDir="column" justify="space-between">
                  <Heading as="h3" variant="title">
                    Delay (ms)
                    <Text variant="required_field"> *</Text>
                  </Heading>
                  <NumberInput
                    defaultValue={400}
                    key={step}
                    min={0}
                    value={steps[step].delay}
                    textAlign="center"
                    onChange={handleChangeDelay}
                  >
                    {' '}
                    <NumberInputField
                      h={14}
                      w="83px"
                      p="16px"
                      textAlign="center"
                      borderColor="gray.50"
                      _placeholder={{ fontSize: 'md' }}
                    />
                  </NumberInput>
                </Flex>
                <Box w={72}>
                  <Heading as="h3" variant="title">
                    Button Type
                  </Heading>
                  <Select
                    color="black"
                    h={14}
                    w="208px"
                    fontSize="md"
                    value={
                      TYPE.find((i) => steps[step].action.type === i.name)!.text
                    }
                    onChange={changeButtonType}
                  >
                    {TYPE.map((item) => (
                      <option key={item.name}>{item.text}</option>
                    ))}
                  </Select>
                </Box>
              </Flex>
              <Flex flexDir="column" my={4}>
                <Heading as="h3" variant="title">
                  Step Text
                  {!steps[step]?.is_substep && (
                    <Text variant="required_field"> *</Text>
                  )}
                </Heading>
                <Textarea
                  borderColor="gray.50"
                  h={28}
                  w={305}
                  placeholder="Enter text..."
                  value={
                    steps[step].translations.length
                      ? steps[step].translations.find(
                        (item) => item.language.id === language?.id,
                      )?.text
                      : ''
                  }
                  onChange={({ target }) =>
                    handleInputChange(target, language!.id)}
                />
              </Flex>
              <Checkbox
                size="lg"
                borderRadius={2}
                mb={2}
                isChecked={steps[step].is_substep}
                onChange={({ target }) =>
                  handleSubstepChange({ target, type: 'sub' })}
              >
                <Text fontSize={14}>This is a substep</Text>
              </Checkbox>
              <Checkbox
                size="lg"
                borderRadius={2}
                isChecked={steps[step].is_animated_step}
                onChange={({ target }) =>
                  handleSubstepChange({ target, type: 'animated' })}
              >
                <Text fontSize={14}>This is an animated step</Text>
              </Checkbox>
              <Flex justify="start" mt={8} mb={8}>
                <Button
                  isDisabled={step === 0}
                  w={40}
                  border="2px"
                  borderColor="gray"
                  color="gray"
                  variant="transparent_button"
                  fontSize="md"
                  onClick={() => onHandleChangeStep('dec')}
                >
                  <Image
                    boxSize={5}
                    transform="rotate(-90deg)"
                    src="/assets/images/arrow-down.png"
                  />
                  Prev Step
                </Button>
                <Button
                  w={40}
                  variant="button_ordinary"
                  disabled={step >= steps.length - 1}
                  fontSize="md"
                  onClick={() => onHandleChangeStep('inc')}
                >
                  Next Step
                  <Image
                    boxSize={5}
                    transform="rotate(-90deg)"
                    src="/assets/images/arrow-down-white.png"
                  />
                </Button>
              </Flex>
            </Flex>
          </Container>

          <Container display="flex" alignItems="center" flexDir="column">
            <Box>
              {step !== 0 && (
                <Button
                  variant="cancel"
                  fontSize="sm"
                  w={32}
                  justifyContent="space-between"
                  px={3}
                  py={3}
                  disabled={steps.length === 1}
                  onClick={removeStep}
                >
                  <Image src="/assets/images/trash.png" />
                  Delete Step
                </Button>
              )}
            </Box>
            <Flex
              justify="center"
              w={steps[step].orientation === 'landscape' ? '400px' : '200px'}
              my={4}
            >
              <Box display="block" position="relative">
                <Box
                  css={{
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    MSUserSelect: 'none',
                  }}
                >
                  <Image
                    src={`${
                      steps[step].orientation === 'landscape'
                        ? tutorial.faceplate?.landscape_image
                        : tutorial.faceplate?.portrait_image
                    }`}
                    zIndex={2}
                    draggable={false}
                    position="relative"
                  />
                  <Image
                    src={
                      steps[step].filePath
                        ? steps[step].filePath
                        : steps[step]?.file_path
                    }
                    zIndex={1}
                    w={
                      steps[step].orientation === 'landscape'
                        ? tutorial.faceplate?.landscape_width
                        : tutorial.faceplate?.portrait_width
                    }
                    position="absolute"
                    float="left"
                    top={`${
                      steps[step].orientation === 'landscape'
                        ? tutorial.faceplate?.landscape_y
                        : tutorial.faceplate?.portrait_y
                    }px`}
                    left={`${
                      steps[step].orientation === 'landscape'
                        ? tutorial.faceplate?.landscape_x
                        : tutorial.faceplate?.portrait_x
                    }px`}
                    h={
                      steps[step].orientation === 'landscape'
                        ? tutorial.faceplate?.landscape_height
                        : tutorial.faceplate?.portrait_height
                    }
                  />
                </Box>
                {steps && (
                  <TouchButton
                    transform={
                      steps[step].orientation === 'landscape'
                        ? 'rotate(90deg)'
                        : ''
                    }
                    top={`${steps[step].action.y}px`}
                    toLeft={`${steps[step].action.x}px`}
                    swipe={steps[step]?.action.type}
                    nextStep={nextStep}
                    setMouseMove={setMouseMove}
                  />
                )}
              </Box>
            </Flex>
            {tutorial.type === 'Interactive' && (
              <Container
                variant="zipFile"
                alignItems="center"
                border="2px"
                borderColor="blue.500"
                bgColor="white"
                color="gray.500"
                py={2}
                px={2}
                h={10}
                _hover={{
                  bg: 'gray.50',
                }}
                borderRadius={40}
              >
                <label
                  htmlFor="png_file"
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    width: 'full',
                    height: 'full',
                    cursor: 'pointer',
                  }}
                >
                  {' '}
                  <Image src="/assets/images/image.png" boxSize={5} mr={2} />
                  <Text fontWeight="600">Change Image</Text>
                  <Input
                    type="file"
                    name="file"
                    key={step}
                    id="png_file"
                    accept=".png, .jpg,"
                    onChange={changeImage}
                  />
                </label>
              </Container>
            )}
          </Container>
        </>
      ) : (
        <LocalLoader />
      )}
    </Flex>
  )
}
