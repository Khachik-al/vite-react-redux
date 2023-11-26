import {
  Box, Button, Checkbox,
  Flex, Heading, Image, Tab, TabList, Tabs, Text, Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LanguageSelector } from '../../../languageSelector'
import { Language } from '../../../../interfaces/features.interface'
import { useAppSelector } from '../../../../redux/hooks'
import type { HtmlSteps } from '../../../../interfaces/tutorials.interface'
import { Translations } from '../../../../interfaces/tutorials.interface'

export const FinishHtmlTutorial = ({
  stepsTutorial,
  stepTutorial,
  handleStepTutorialChange,
  requiredLanguage,
  handleStepsTutorialChange,
}: {
  stepsTutorial: HtmlSteps[]
  stepTutorial: number
  handleStepTutorialChange: (value: number) => void
  requiredLanguage: Language
  handleStepsTutorialChange: (prev: HtmlSteps[]) => void
}) => {
  const { languages } = useAppSelector((state) => state.products)
  const [language, setLanguage] = useState(requiredLanguage)

  const handleSubstepChange = ({
    target,
  }: {
    target: { checked: boolean }
  }) => {
    const newHtmlSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          isSubstep: target.checked,
        }
      }
      return item
    })
    handleStepsTutorialChange(newHtmlSteps)
  }

  const handleClickPrevStep = () => {
    if (stepTutorial > 0) {
      handleStepTutorialChange(stepTutorial - 1)
    }
  }

  const nextStep = () => {
    if (stepTutorial < stepsTutorial.length - 1) {
      handleStepTutorialChange(stepTutorial + 1)
    }
  }

  const handleInputChange = (target: { value: string }, id: string) => {
    const newSteps = stepsTutorial.map((item, index) => {
      if (index === stepTutorial) {
        return {
          ...stepsTutorial[stepTutorial],
          text:
            language?.name === requiredLanguage.name
              ? target.value
              : stepsTutorial[stepTutorial].text,
          translations: [
            ...stepsTutorial[stepTutorial].translations.map((t: Translations) => {
              if (id === t.languageId) {
                return {
                  value: { text: target.value },
                  languageId: t.languageId,
                }
              }
              return t
            }),
          ],
        }
      }
      return item
    })
    handleStepsTutorialChange(newSteps)
  }

  return (
    <Box>
      <Flex alignItems="center" pb={4}>
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
      <LanguageSelector
        language={language || languages[0]}
        setLanguage={setLanguage}
      />
      <Box mt={5}>
        <Text mb={2} fontWeight={600}>
          Step Text
        </Text>
        <Textarea
          borderColor="gray.50"
          h={28}
          placeholder="Enter text..."
          value={
            stepsTutorial[stepTutorial].translations.length
              ? stepsTutorial[stepTutorial].translations.find(
                (item) => item.languageId === language?.id,
              )?.value.text
              : ''
          }
          onChange={({ target }) => handleInputChange(target, language!.id)}
        />
        <Checkbox
          mt={4}
          size="lg"
          borderRadius={2}
          isChecked={stepsTutorial[stepTutorial].isSubstep}
          onChange={handleSubstepChange}
        >
          <Text fontSize={14}>This is a substep</Text>
        </Checkbox>
        <Flex mt={8}>
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
            {(stepsTutorial[stepTutorial].translations.find(
              (item) => item.value.text,
            )
              || stepsTutorial[stepTutorial].isSubstep) && (
              <Image
                boxSize={5}
                transform="rotate(-90deg)"
                src="/assets/images/arrow-down.png"
              />
            )}
            Prev Step
          </Button>
          <Button
            w={52}
            variant="button_ordinary"
            fontSize="md"
            onClick={nextStep}
            disabled={stepTutorial === stepsTutorial.length - 1}
          >
            Next Step
            <Image
              boxSize={5}
              transform="rotate(-90deg)"
              src="/assets/images/arrow-down-white.png"
            />
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}
