import { FC, useEffect, useState } from 'react'
import { Text } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import {
  getTutorial,
  getTutorialSteps,
} from '../../services/api/content.service'
import { HtmlTutorial } from './html'
import { LocalLoader } from '../localLoader'
import { getDevices } from '../../redux/slices/products'
import { InteractiveTutorial } from './interactive'
import type { Steps, TutorialsData } from '../../interfaces/tutorials.interface'
import type { Categories, Product, ResponseType } from '../../interfaces/data.interface'
import type { Language } from '../../interfaces/features.interface'

const Tutorial: FC<{
  tutorial: TutorialsData
  language: Language
  setLanguage: (language: any) => void
  setTutorial: (d: TutorialsData) => void
  devices: Product['deviceList'][]
  steps: Steps[]
  setSteps: (prev: any) => void
}> = ({
  tutorial, language, setLanguage, setTutorial, devices, steps, setSteps,
}) => {
  if (tutorial.type === 'Interactive') {
    return (
      <InteractiveTutorial
        tutorial={tutorial}
        devices={devices}
        language={language}
        steps={steps}
        setSteps={setSteps}
        setTutorial={setTutorial}
        setLanguage={setLanguage}
      />
    )
  }
  if (tutorial.type === 'HTML5') {
    return (
      <HtmlTutorial
        tutorial={tutorial}
        devices={devices}
        language={language}
        steps={steps}
        setSteps={setSteps}
        setTutorial={setTutorial}
        setLanguage={setLanguage}
      />
    )
  }
  return null
}

export const EditTutorial = () => {
  const {
    auth: { token },
    products: { devices, languages },
  } = useAppSelector((state) => state)

  const [tutorial, setTutorial] = useState<TutorialsData>()
  const [steps, setSteps] = useState<Steps[]>([])
  const [language, setLanguage] = useState<Language>({
    id: '',
    name: 'English',
    code: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const { showErrorMessage } = useNotifications()

  const dispatch = useAppDispatch()

  const { search } = useLocation()

  const getTutorialById = async () => {
    try {
      const res = await getTutorial({ id: search.slice(4), token })() as ResponseType<TutorialsData>

      if (!res.ok) {
        throw new Error('No tutorial found')
      }

      const { data } = await res.json()
      setTutorial(() => ({
        ...data,
        categories: data.categories.map((i: Categories) => ({
          ...i,
          checked: true,
        })),
      }))
    } catch (error) {
      if (error instanceof Error) {
        showErrorMessage(error.message)
        setErrorMessage(error.message)
        console.log(error)
      }
    }
  }

  const getSteps = async () => {
    try {
      const res = (await getTutorialSteps({
        id: search.slice(4),
        token,
      })()) as ResponseType<Steps[]>
      const { data } = await res.json()
      setSteps(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (languages.length) {
      setLanguage({
        id: languages[0].id,
        name: languages[0].name,
        code: languages[0].code,
      })
    }
  }, [languages])

  useEffect(() => {
    dispatch(getDevices())
    getTutorialById()
    getSteps()
  }, [])

  if (tutorial) {
    return (
      <Tutorial
        devices={devices.deviceList}
        tutorial={tutorial}
        language={language}
        setTutorial={setTutorial}
        setLanguage={setLanguage}
        steps={steps}
        setSteps={setSteps}
      />
    )
  }

  if (errorMessage) {
    return <Text>{errorMessage}</Text>
  }

  return <LocalLoader />
}
