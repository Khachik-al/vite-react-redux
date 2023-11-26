import {
  Button, Container, Flex, Heading,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { Language } from '../../interfaces/features.interface'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getLanguages } from '../../redux/slices/products'
import { LocalLoader } from '../localLoader'

export const LanguageSelector = ({
  language,
  setLanguage,
}: {
  language: { name: string; id: string }
  setLanguage: (language: Language) => void
}) => {
  const dispatch = useAppDispatch()
  const { languages } = useAppSelector((state) => state.products)
  useEffect(() => {
    dispatch(getLanguages())
  }, [])
  return (
    <Flex flexDir="column">
      <Heading as="h2" fontSize="md" pb={2}>
        Language
      </Heading>
      <Container variant="language">
        {languages.length ? (
          languages.map((item) => (
            <Button
              mx={1}
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
          ))
        ) : (
          <LocalLoader />
        )}
      </Container>
    </Flex>
  )
}
