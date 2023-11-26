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
  useDisclosure,
} from '@chakra-ui/react'
import {
  ChangeEvent, useEffect, useMemo, useState,
} from 'react'
import { useHandleImageUpload } from '../../../../hooks/useHandleImageUpload'
import { Language } from '../../../../interfaces/features.interface'
import {
  Step,
  Translations,
  Tutorial,
  TypeButton,
} from '../../../../interfaces/tutorials.interface'
import { useAppSelector } from '../../../../redux/hooks'
import { LanguageSelector } from '../../../languageSelector'
import { TouchButton } from '../../../touchButton/touchButton'
import { TextEditor } from '../../TextEditor'

export type MouseMove = {
  downX: number
  leaveX: number
  movingX: number
  downY: number
  leaveY: number
  movingY: number
}

export const IncrementButtons = ({
  xCoord,
  yCoord,
  movingButtonImages,
  isDisabled,
}: {
  xCoord: number
  yCoord: number
  movingButtonImages: ({ x, y }: { x: number; y: number }) => void
  isDisabled: boolean
}) => {
  const move = 1
  const [auxiliaryNotification, setAuxiliaryNotification] = useState({
    message: 'Select the button type',
    show: false,
  })
  const handleClick = () => {
    if (!isDisabled) return
    setAuxiliaryNotification((prev) => ({
      ...prev,
      show: true,
    }))
    setTimeout(() => {
      setAuxiliaryNotification((prev) => ({
        ...prev,
        show: false,
      }))
    }, 3000)
  }
  return (
    <Box onClick={handleClick}>
      <Flex
        cursor={isDisabled ? 'not-allowed' : 'ew-resize'}
        align="center"
        onWheel={(e) => movingButtonImages({ x: e.deltaY, y: 0 })}
      >
        <Text fontWeight={600}>
          X =
          {' '}
          {xCoord}
        </Text>
        <Button
          onClick={() => movingButtonImages({ x: move, y: 0 })}
          variant="increment_button"
          isDisabled={isDisabled}
        >
          +
        </Button>
        <Button
          onClick={() => movingButtonImages({ x: -move, y: 0 })}
          variant="increment_button"
          isDisabled={isDisabled}
        >
          -
        </Button>
        {auxiliaryNotification.show && (
          <Text ml="2" color="red" fontSize="xs" fontWeight="light">
            {auxiliaryNotification.message}
          </Text>
        )}
      </Flex>
      <Flex
        cursor={isDisabled ? 'not-allowed' : 'row-resize'}
        align="center"
        onWheel={(e) => movingButtonImages({ x: 0, y: e.deltaY })}
      >
        <Text fontWeight={600}>
          Y =
          {' '}
          {yCoord}
        </Text>
        <Button
          onClick={() => movingButtonImages({ x: 0, y: move })}
          variant="increment_button"
          isDisabled={isDisabled}
        >
          +
        </Button>
        <Button
          onClick={() => movingButtonImages({ x: 0, y: -move })}
          variant="increment_button"
          isDisabled={isDisabled}
        >
          -
        </Button>
      </Flex>
    </Box>
  )
}

export const FinishTutorial = ({
  stepsTutorial,
  handleStepsTutorialChange,
  tutorial,
  stepTutorial,
  handleStepTutorialChange,
  isTutorialStepNotification,
  requiredLanguage,
}: {
  stepsTutorial: Step[]
  handleStepsTutorialChange: (prev: Step[]) => void
  tutorial: Tutorial
  stepTutorial: number
  handleStepTutorialChange: (value: number) => void
  isTutorialStepNotification: boolean
  requiredLanguage: Language
}) => {
  const { languages } = useAppSelector((state) => state.products)
  const [language, setLanguage] = useState(requiredLanguage)
  const [delay, setDelay] = useState<string | number>(400)
  const currentStepText = useMemo(
    () =>
      stepsTutorial[stepTutorial].translations.find(
        (item) => item.languageId === language?.id,
      )?.value.text || '',
    [language, stepTutorial, stepsTutorial[stepTutorial].translations],
  )

  const [mouseMove, setMouseMove] = useState<MouseMove>({
    downX: 0,
    leaveX: 0,
    movingX: 0,
    downY: 0,
    leaveY: 0,
    movingY: 0,
  })
  const {
    onClose: onTextEditorClose,
    onOpen: onTextEditorOpen,
    isOpen: isTextEditorOpen,
  } = useDisclosure()
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

  const newStep = () =>
    ({
      isSubstep: false,
      isAnimatedStep: false,
      order: stepsTutorial.length,
      orientation: 'portrait',
      delay: 0,
      action: {
        type: 'automate',
        x: 0,
        y: 0,
        isOnScreen: false,
      },
      text: '',
      filePath: {
        file: stepsTutorial[stepTutorial].filePath.file,
        fileName: stepsTutorial[stepTutorial].filePath.fileName,
        fileImg: stepsTutorial[stepTutorial].filePath.fileImg,
        id: String(Math.random()),
      },
      translations: languages.map((item) => ({
        value: { text: '' },
        languageId: item.id,
      })),
    } as Step)

  const changeButtonType = (e: ChangeEvent<HTMLSelectElement>) => {
    const t = TYPE.find((i) => e.target.value === i.text)!.name
    const newSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          action: {
            ...stepsTutorial[stepTutorial].action,
            type: t,
            isOnScreen: t !== 'automate',
          },
        }
      }
      return item
    })
    handleStepsTutorialChange(newSteps)
  }

  const nextStep = () => {
    if (stepTutorial + 1 === stepsTutorial.length) {
      handleStepsTutorialChange([...stepsTutorial, newStep()])
    }
    handleStepTutorialChange(stepTutorial + 1)
  }

  const deleteStep = () => {
    if (stepsTutorial[stepTutorial].isSubstep) return
    if (!currentStepText) {
      const newSteps = stepsTutorial
        .filter((_, index) => index !== stepTutorial)
        .map((item, index) => ({ ...item, order: index }))
      handleStepsTutorialChange(newSteps)
    }
  }

  const handleInputChange = (value: string, id: string) => {
    const newSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          text:
            language?.name === requiredLanguage.name
              ? value
              : stepsTutorial[stepTutorial].text,
          translations: [
            ...stepsTutorial[stepTutorial].translations.map(
              (t: Translations) => {
                if (id === t.languageId) {
                  return {
                    value: { text: value },
                    languageId: t.languageId,
                  }
                }
                return t
              },
            ),
          ],
        }
      }
      return item
    })
    handleStepsTutorialChange(newSteps)
  }

  const handleSubstepChange = ({
    target,
  }: {
    target: { checked: boolean }
  }) => {
    const newSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          isSubstep: target.checked,
        }
      }
      return item
    })
    handleStepsTutorialChange(newSteps)
  }

  const changeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const base64 = await useHandleImageUpload(files)

    if (!base64) return
    const newSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          filePath: {
            file: files[0],
            fileName: files[0].name,
            fileImg: String(base64[0]),
            id: String(Math.random()),
          },
        }
      }
      return item
    })
    handleStepsTutorialChange(newSteps)
  }

  const movingButtonImages = ({ x = 0, y = 0 }: { x: number; y: number }) => {
    if (stepsTutorial[stepTutorial].action.type === 'automate') return
    const screenWidth = 181
    const screenHeight = 391
    const clamp = (interval: number, max: number) =>
      Math.max(0, Math.min(interval, max))
    const t = () => {
      switch (stepsTutorial[stepTutorial].orientation) {
        case 'portrait':
          return {
            moveX: clamp(x + stepsTutorial[stepTutorial].action.x, screenWidth),
            moveY: clamp(
              y + stepsTutorial[stepTutorial].action.y,
              screenHeight,
            ),
          }
          break
        case 'landscape':
          return {
            moveX: clamp(
              x + stepsTutorial[stepTutorial].action.x,
              screenHeight,
            ),
            moveY: clamp(y + stepsTutorial[stepTutorial].action.y, screenWidth),
          }
          break
        default:
          return {
            moveX: clamp(x + stepsTutorial[stepTutorial].action.x, screenWidth),
            moveY: clamp(
              y + stepsTutorial[stepTutorial].action.y,
              screenHeight,
            ),
          }
      }
    }
    const newSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          action: {
            ...stepsTutorial[stepTutorial].action,
            x: t().moveX,
            y: t().moveY,
          },
        }
      }
      return item
    })
    handleStepsTutorialChange(newSteps)
  }

  const phoneRotation = (position: 'landscape' | 'portrait') => {
    const newSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          orientation: position,
          action: {
            ...stepsTutorial[stepTutorial].action,
            x: 0,
            y: 0,
          },
        }
      }
      return item
    })
    handleStepsTutorialChange(newSteps)
  }

  const handleChangeDelay = (_valueAsString: string) => {
    const validValue = _valueAsString.match(/[0-9]*\.?[0-9]*/g)
    const newDelay = validValue ? validValue[0] : 0
    setDelay(newDelay)
  }

  const changeDelay = () => {
    setDelay(Number(delay))
    const newSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          delay: Number(delay),
        }
      }
      return item
    })
    handleStepsTutorialChange(newSteps)
  }

  const handleClickPrevStep = () => {
    if (stepTutorial > 0) {
      deleteStep()
      handleStepTutorialChange(stepTutorial - 1)
    }
  }

  const isDisabledNewStep = useMemo(
    () => !stepsTutorial[stepTutorial].isSubstep && !currentStepText,
    [stepsTutorial[stepTutorial].isSubstep, currentStepText],
  )

  useEffect(() => {
    setDelay(stepsTutorial[stepTutorial].delay)
  }, [stepTutorial])

  useEffect(() => {
    movingButtonImages({ x: mouseMove.movingX, y: mouseMove.movingY })
  }, [mouseMove.movingX, mouseMove.movingY])

  return (
    <Flex justify="space-between">
      <Flex w="full" minW="md" flexDir="column" mr={14}>
        <TextEditor
          onClose={onTextEditorClose}
          isOpen={isTextEditorOpen}
          onChange={handleInputChange}
          defaultValue={currentStepText}
          lang={language!.id}
        />
        <Flex pb={4}>
          <Heading as="h2" fontSize="lg" mr={4}>
            Tutorial Step
            {' '}
            {stepTutorial + 1}
          </Heading>
          <Tabs
            variant="soft-rounded"
            index={stepTutorial}
            display="flex"
            align="center"
            onChange={(i) => handleStepTutorialChange(i)}
          >
            <TabList gap={4} height={1}>
              {stepsTutorial.map((_, i) => (
                <Tab
                  value={i}
                  bgColor={
                    stepTutorial === i ? 'blue.500 !important' : 'gray.50'
                  }
                  w={2}
                  h={2}
                  p={0}
                />
              ))}
            </TabList>
          </Tabs>
        </Flex>
        {tutorial.type === 'Interactive' && (
          <>
            <Box my={4}>
              <Heading as="h2" fontSize="sm" mb={2}>
                Button on LCD =
                {' '}
                {stepsTutorial[stepTutorial].action.type === 'automate'
                  ? 'NO'
                  : 'YES'}
              </Heading>
              <IncrementButtons
                xCoord={stepsTutorial[stepTutorial].action.x}
                yCoord={stepsTutorial[stepTutorial].action.y}
                movingButtonImages={movingButtonImages}
                isDisabled={
                  stepsTutorial[stepTutorial].action.type === 'automate'
                }
              />
            </Box>
            <Flex justify="space-between" mb={4}>
              <Flex flexDir="column" justify="space-between">
                <Heading as="h3" variant="title">
                  Delay (ms)
                  <Text variant="required_field"> *</Text>
                </Heading>
                <NumberInput
                  defaultValue={400}
                  key={stepTutorial}
                  min={0}
                  value={delay}
                  textAlign="center"
                  onChange={handleChangeDelay}
                  onBlur={changeDelay}
                >
                  {' '}
                  <NumberInputField
                    h={14}
                    w={28}
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
                  fontSize="md"
                  value={
                    TYPE.find(
                      (i) => stepsTutorial[stepTutorial].action.type === i.name,
                    )!.text
                  }
                  onChange={changeButtonType}
                >
                  {TYPE.map((item) => (
                    <option>{item.text}</option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </>
        )}
        <LanguageSelector
          language={language || languages[0]}
          setLanguage={setLanguage}
        />
        <Flex flexDir="column" my={4}>
          <Heading as="h3" variant="title">
            Step Text
            {!stepsTutorial[stepTutorial]?.isSubstep && (
              <Text variant="required_field"> *</Text>
            )}
            {!stepsTutorial[stepTutorial]?.isSubstep
              && isTutorialStepNotification && (
                <Text ml="2" color="red" fontSize="xs" fontWeight="light">
                  required
                </Text>
            )}
            <Button ml={3} onClick={onTextEditorOpen}>
              Edit
            </Button>
          </Heading>
          <Box
            border="1px solid #dfe6e9"
            borderRadius={10}
            h={28}
            p={2}
            overflow="auto"
            cursor="text"
            onClick={onTextEditorOpen}
          >
            {!currentStepText && (
              <Text color="gray.500">Edit step text...</Text>
            )}
            <Box
              p={3}
              dangerouslySetInnerHTML={{
                __html: currentStepText,
              }}
            />
          </Box>
        </Flex>
        <Checkbox
          size="lg"
          borderRadius={2}
          isChecked={stepsTutorial[stepTutorial].isSubstep}
          onChange={handleSubstepChange}
        >
          <Text fontSize={14}>This is a substep</Text>
        </Checkbox>
        <Flex justify="space-between" mt={8}>
          <Button
            isDisabled={stepTutorial === 0}
            w={52}
            border="2px"
            borderColor="gray"
            color="gray"
            variant="transparent_button"
            fontSize="md"
            onClick={handleClickPrevStep}
          >
            {(currentStepText || stepsTutorial[stepTutorial].isSubstep) && (
              <Image
                boxSize={5}
                transform="rotate(-90deg)"
                src="/assets/images/arrow-down.png"
              />
            )}
            {currentStepText || stepsTutorial[stepTutorial].isSubstep
              ? 'Prev Step'
              : 'Delete Step'}
          </Button>
          <Button
            w={52}
            variant="button_ordinary"
            fontSize="md"
            onClick={nextStep}
            isDisabled={isDisabledNewStep}
          >
            {stepTutorial === stepsTutorial.length - 1
              ? 'New Step'
              : 'Next Step'}
            <Image
              boxSize={5}
              transform="rotate(-90deg)"
              src="/assets/images/arrow-down-white.png"
            />
          </Button>
        </Flex>
      </Flex>
      <Flex flexDir="column" align="flex-end" justify="space-between" maxW="md">
        {tutorial.type === 'Interactive' && (
          <Flex>
            <Button
              bg={
                stepsTutorial[stepTutorial].orientation === 'portrait'
                  ? 'blue.500'
                  : 'gray.50'
              }
              variant="position_button"
              onClick={() => phoneRotation('portrait')}
            >
              <Image
                filter={
                  stepsTutorial[stepTutorial].orientation === 'portrait'
                    ? 'invert(0)'
                    : 'invert(1)'
                }
                boxSize={5}
                src="/assets/images/mobile-white.png"
              />
            </Button>
            <Button
              bg={
                stepsTutorial[stepTutorial].orientation === 'landscape'
                  ? 'blue.500'
                  : 'gray.50'
              }
              variant="position_button"
              onClick={() => phoneRotation('landscape')}
            >
              <Image
                transition="0.4s all ease"
                filter={
                  stepsTutorial[stepTutorial].orientation === 'landscape'
                    ? 'invert(0)'
                    : 'invert(1)'
                }
                boxSize={5}
                transform="rotate(-90deg)"
                src="/assets/images/mobile-white.png"
              />
            </Button>
          </Flex>
        )}
        <Flex
          justify="center"
          w={
            stepsTutorial[stepTutorial].orientation === 'landscape'
              ? '400px'
              : '200px'
          }
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
                  stepsTutorial[stepTutorial].orientation === 'landscape'
                    ? tutorial.faceplate?.landscape_image
                    : tutorial.faceplate?.portrait_image
                }`}
                zIndex={2}
                draggable={false}
                position="relative"
              />
              <Image
                src={stepsTutorial[stepTutorial]?.filePath.fileImg}
                zIndex={1}
                w={
                  stepsTutorial[stepTutorial].orientation === 'landscape'
                    ? tutorial.faceplate?.landscape_width
                    : tutorial.faceplate?.portrait_width
                }
                position="absolute"
                float="left"
                top={`${
                  stepsTutorial[stepTutorial].orientation === 'landscape'
                    ? tutorial.faceplate?.landscape_y
                    : tutorial.faceplate?.portrait_y
                }px`}
                left={`${
                  stepsTutorial[stepTutorial].orientation === 'landscape'
                    ? tutorial.faceplate?.landscape_x
                    : tutorial.faceplate?.portrait_x
                }px`}
                h={
                  stepsTutorial[stepTutorial].orientation === 'landscape'
                    ? tutorial.faceplate?.landscape_height
                    : tutorial.faceplate?.portrait_height
                }
              />
            </Box>
            {stepsTutorial && (
              <TouchButton
                transform={
                  stepsTutorial[stepTutorial].orientation === 'landscape'
                    ? 'rotate(90deg)'
                    : ''
                }
                top={`${stepsTutorial[stepTutorial].action.y}px`}
                toLeft={`${stepsTutorial[stepTutorial].action.x}px`}
                swipe={stepsTutorial[stepTutorial]?.action.type}
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
            px={4}
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
                key={stepTutorial}
                id="png_file"
                accept=".png, .jpg,"
                onChange={changeImage}
              />
            </label>
          </Container>
        )}
      </Flex>
    </Flex>
  )
}
