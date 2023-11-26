import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { useNotifications } from '../../../hooks/useNotifications'
import type { Language } from '../../../interfaces/features.interface'
import type {
  Steps,
  StepTranslation,
} from '../../../interfaces/tutorials.interface'
import { useAppSelector } from '../../../redux/hooks'
import { LocalLoader } from '../../localLoader'
import { HTMLFileModal } from '../../modals/htmlFileModal'

export const EditHtmlTutorialStep = ({
  language,
  steps,
  setSteps,
}: {
  language: Language
  steps: Steps[]
  setSteps: (prev: any) => void
}) => {
  const [step, setStep] = useState(0)
  const [fileUrl, setFileUrl] = useState<string>()
  const { languages } = useAppSelector((state) => state.products)
  const { showSuccessMessage, showErrorMessage } = useNotifications()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const handleInputChange = (target: { value: string }) => {
    const newSteps = steps.map((item, index) => {
      if (index === step) {
        return {
          ...steps[step],
          text: language?.name === 'English' ? target.value : steps[step].text,
          translations: [
            ...steps[step].translations.map((t: StepTranslation) => {
              if (language.id === t.language.id) {
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

  const addNewStep = () => {
    setSteps((prev: Steps[]) => [
      ...prev,
      {
        is_substep: false,
        is_animated_step: false,
        animation: [],
        order: steps.length,
        orientation: 'portrait',
        delay: 0,
        action: null,
        text: '',
        file_path: steps[step].file_path,
        translations: languages.map((item) => ({
          id: item.id,
          language: { id: item.id, name: item.name, code: item.code },
          text: '',
        })),
        id: Math.random(),
      } as any,
    ])
    setStep(() => steps.length)
  }

  const removeStep = () => {
    const newSteps = steps
      .filter((_, index) => index !== step)
      .map((item, index) => ({ ...item, order: index }))
    setStep((prev) => prev - 1)
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
    setFileUrl(e.target.value)
  }

  const saveHtmlUrl = () => {
    try {
      const newSteps = steps.map((item, index) => {
        if (index === step) {
          return {
            ...steps[step],
            file_path: fileUrl,
          }
        }
        return item
      })
      setSteps(newSteps)
      onClose()
      showSuccessMessage('The Link Has Been Successfully Updated')
    } catch (error) {
      showErrorMessage('Something Wrong')
      console.log(error)
    }
  }

  useEffect(() => {
    setStep(0)
  }, [])

  useEffect(() => {
    setFileUrl(steps[step]?.file_path)
  }, [steps])

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
                <Button
                  onClick={addNewStep}
                  variant="square_button"
                  fontSize="xs"
                >
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
                  onChange={({ target }) => handleInputChange(target)}
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
              <Button
                variant="cancel"
                fontSize="sm"
                w={32}
                justifyContent="space-between"
                px={3}
                disabled={step === 0 || steps.length === 1}
                py={3}
                onClick={removeStep}
              >
                <Image src="/assets/images/trash.png" />
                Delete Step
              </Button>
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
                  <iframe
                    src={steps[step].file_path}
                    width={400}
                    height={600}
                    title="phone"
                  />
                </Box>
              </Box>
            </Flex>
            <Button onClick={onOpen} variant="outlined_button">
              <Image src="/assets/images/image.png" boxSize={5} mr={2} />
              <Text fontWeight="600">Change Image</Text>
            </Button>
            <HTMLFileModal
              isOpen={isOpen}
              save={saveHtmlUrl}
              onClose={onClose}
              setValue={changeImage}
              value={fileUrl}
            />
          </Container>
        </>
      ) : (
        <LocalLoader />
      )}
    </Flex>
  )
}
