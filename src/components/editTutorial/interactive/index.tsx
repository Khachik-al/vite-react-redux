import { Button, Container, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  Category,
  NameTypeButton,
  PostStep,
  Steps,
  Tutorial,
  TutorialsData,
  UpdatedTutorial,
} from '../../../interfaces/tutorials.interface'
import type { Product, ResponseType } from '../../../interfaces/data.interface'
import { EditTutorial } from './editTutorial'
import { EditTutorialStep } from './editTutorialStep'
import { Language } from '../../../interfaces/features.interface'
import { postStepTutorial, updateTutorial } from '../../../services/api'
import { useNotifications } from '../../../hooks/useNotifications'
import { useAppSelector } from '../../../redux/hooks'

export const InteractiveTutorial = ({
  tutorial,
  devices,
  language,
  setTutorial,
  setLanguage,
  steps,
  setSteps,
}: {
  tutorial: TutorialsData
  devices: Product['deviceList'][]
  setTutorial: (d: any) => void
  language: Language
  setLanguage: (lang: any) => void
  steps: Steps[]
  setSteps: (prev: any) => void
}) => {
  const navigate = useNavigate()
  const { token } = useAppSelector((state) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(tutorial.title)
  const { showSuccessMessage, showErrorMessage } = useNotifications()

  const handleCategoriesChange = (newCategories: Category[]) => {
    setTutorial((prev: TutorialsData) => ({
      ...prev,
      categories: newCategories,
    }))
  }
  const onHandleToggleModal = () => setIsOpen((prev) => !prev)

  const handleTutorialChange = (newTutorial: Tutorial) => {
    setTutorial(newTutorial)
  }

  const onHandleToggleStatus = (status: boolean) => {
    setTutorial((prev: TutorialsData[]) => ({
      ...prev,
      is_public: status,
    }))
    setIsOpen((prev) => !prev)
  }

  const goBack = () => navigate('/content')

  const updateTutorialData = async () => {
    try {
      const newData: UpdatedTutorial = {
        productId: tutorial.product.id,
        type: tutorial.type,
        customerIds: tutorial.customers
          .filter((c) => c.checked)
          .map((c) => c.id),
        categoryIds: tutorial.categories.map((c) => c.id),
        isPublic: tutorial.is_public,
        title: tutorial.translations.find((i) => i.language.name === 'English')!
          .title,
        translations: tutorial.translations.map((t) => ({
          languageId: t.language.id,
          value: {
            title: t.title,
          },
        })),
      }
      setTitle(
        tutorial.translations.find((i) => i.language.name === 'English')!.title,
      )
      const res = (await updateTutorial({
        token,
        body: newData,
        id: tutorial.id,
      })()) as ResponseType<Tutorial>
      const { message, error } = await res.json()
      if (error) {
        return showErrorMessage(`Something wrong with Tutorial: ${message}`)
      }
      showSuccessMessage(message)
    } catch (error) {
      if (error instanceof Error) {
        showErrorMessage(error.message)
        console.log(error)
      }
    }
    return null
  }

  const updateSteps = async () => {
    try {
      const newData = steps.map((i) => ({
        isSubstep: i.is_substep,
        isAnimatedStep: i.is_animated_step,
        animation: i.is_animated_step
          ? [
            {
              order: 0,
              imagePath: i.filePath || i.file_path,
              delay: 400,
            },
          ]
          : undefined,
        order: i.order,
        orientation: i.orientation,
        delay: i.delay,
        action: {
          type: i.action.type as NameTypeButton,
          x: i.action.x,
          y: i.action.y,
          isOnScreen: i.action.on_screen,
        },
        text: i.translations.find((t) => t.language.name === 'English')?.text,
        filePath: i.filePath || i.file_path,
        translations: i.translations.map((t) => ({
          languageId: t.language.id,
          value: {
            text: t.text,
          },
        })),
      })) as PostStep[]
      const resStep = (await postStepTutorial({
        token,
        body: newData,
        id: tutorial.id,
      })()) as ResponseType
      const { message, error } = await resStep.json()
      if (error) {
        return showErrorMessage(
          `Something wrong with Tutorial Steps: ${message}`,
        )
      }
      showSuccessMessage(message)
    } catch (error) {
      console.log(error)
    }
    return null
  }

  const saveTutorial = async () => {
    try {
      const tutorialData = await updateTutorialData()
      const stepsData = await updateSteps()
      await Promise.all([tutorialData, stepsData])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setTitle(
      tutorial.translations.find((i) => i.language.name === language.name)!
        .title,
    )
  }, [language])

  return (
    <>
      <Container variant="contentContainer" h="full">
        <EditTutorial
          devices={devices}
          isOpen={isOpen}
          language={language}
          onHandleToggleModal={onHandleToggleModal}
          onHandleToggleStatus={onHandleToggleStatus}
          tutorial={tutorial}
          setLanguage={setLanguage}
          setTutorial={setTutorial}
          handleTutorialChange={handleTutorialChange}
          handleCategoriesChange={handleCategoriesChange}
          title={title}
        />
        <EditTutorialStep
          tutorial={tutorial}
          language={language}
          setTutorial={setTutorial}
          steps={steps}
          setSteps={setSteps}
        />
      </Container>
      <Flex pos="absolute" bottom="100" right="10">
        <Button
          onClick={goBack}
          borderColor="gray.100"
          variant="outlined_button"
        >
          Cancel
        </Button>
        <Button onClick={saveTutorial} variant="save">
          Save
        </Button>
      </Flex>
    </>
  )
}
