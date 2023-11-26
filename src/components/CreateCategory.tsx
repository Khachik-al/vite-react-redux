import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { ChangeEvent, useRef, useState } from 'react'
import { Metadata } from '../interfaces/metadata.interface'
import { normalizeSpaces } from '../utils/helper'
import type { InputCategory } from './modals/tutorials/tutorialsInfo'

export const CreateCategory = ({
  onClose,
  inputCategory,
  setInputCategory,
  addCategory,
  languages,
  isDisable,
  isOpen,
}: {
  onClose: () => void
  inputCategory: InputCategory[]
  setInputCategory: (prev: any) => void
  addCategory: () => void
  languages: Metadata['languages']
  isDisable: boolean
  isOpen: boolean
}) => {
  const [validationError, setValidationError] = useState(false)
  const errorRef = useRef(true)
  const handleChange = ({
    e,
    type,
  }: {
    e: ChangeEvent<HTMLInputElement>
    type: 'en' | 'es' | 'informal_es'
  }) => {
    errorRef.current = false
    setValidationError(false)
    setInputCategory((prev: InputCategory[]) =>
      prev.map((item) => {
        if (item.code === type) {
          return {
            ...item,
            title: e.target.value,
          }
        }
        return item
      }))
  }

  const handleClickCancel = () => {
    setInputCategory(() =>
      languages.map((i) => ({
        title: '',
        languageId: i.id,
        code: i.code,
        languageName: i.name,
      })))
    onClose()
  }

  const handleClickCreate = async () => {
    setInputCategory((prev: InputCategory[]) =>
      prev.map((item) => ({
        ...item,
        title: normalizeSpaces(item.title),
      })))
    await addCategory()
    onClose()
  }

  const renderCategory = (type: string) =>
    inputCategory.find((item) => item.code === type) || { title: '' }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader fontSize="lg" fontWeight="semibold">
          Create a category
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir="column">
            <Heading as="h3" variant="title">
              EN New Category Title
              <Text variant="required_field"> *</Text>
              {validationError && (
                <Text ml="2" color="red" fontSize="xs" fontWeight="light">
                  Validation error
                </Text>
              )}
            </Heading>
            <Input
              h={12}
              placeholder="Name your category"
              value={renderCategory('en').title}
              onChange={(e) => handleChange({ e, type: 'en' })}
            />
          </Flex>
          <Flex mt={8} flexDir="column">
            <Heading as="h3" variant="title">
              ES New Category Title
              <Text variant="required_field"> *</Text>
              {validationError && (
                <Text ml="2" color="red" fontSize="xs" fontWeight="light">
                  Validation error
                </Text>
              )}
            </Heading>
            <Input
              h={12}
              placeholder="Name your category"
              value={renderCategory('es').title}
              onChange={(e) => handleChange({ e, type: 'es' })}
            />
          </Flex>
          <Flex mt={8} flexDir="column">
            <Heading as="h3" variant="title">
              I-ES New Category Title
              <Text variant="required_field"> *</Text>
              {validationError && (
                <Text ml="2" color="red" fontSize="xs" fontWeight="light">
                  Validation error
                </Text>
              )}
            </Heading>
            <Input
              h={12}
              placeholder="Name your category"
              value={renderCategory('informal_es').title}
              onChange={(e) => handleChange({ e, type: 'informal_es' })}
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup display="flex" mt={8} justifyContent="flex-end">
            <Button onClick={handleClickCancel} variant="cancel" mr={2}>
              Cancel
            </Button>
            <Button
              isDisabled={isDisable || errorRef.current}
              variant="save"
              onClick={handleClickCreate}
            >
              Create
              {isDisable && <Spinner ml={2} color="white" />}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
