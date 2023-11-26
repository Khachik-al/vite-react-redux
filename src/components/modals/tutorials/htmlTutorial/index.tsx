import {
  Box,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Image,
  Input,
  Text,
} from '@chakra-ui/react'
import { ChangeEvent } from 'react'

type HtmlSteps = {
  url: {
    src: string
  }
  zip: {
    data: File | null
    fileName: string
  }
}

export const HtmlTutorial = ({
  steps,
  addNewHtmlStep,
  removeHtmlStep,
  handleFileReader,
  changeFileName,
  handleInputChange,
}: {
  steps: HtmlSteps[]
  addNewHtmlStep: (type: 'url' | 'zip') => void
  removeHtmlStep: (id: number) => void
  handleFileReader: (event: any) => void
  changeFileName: (value: string, index: number) => void
  handleInputChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void
}) => (
  <Container p={0} m={0} maxW="none">
    <Flex gap={5}>
      <Container
        variant="uploadImage"
        w="160px"
        h="56px"
        onClick={() => addNewHtmlStep('url')}
      >
        <Image src="/assets/images/blue_add.png" />
        <Text fontSize="xs" fontWeight="700">
          Add New URL
        </Text>
      </Container>
      <Container variant="zipFile" alignItems="center">
        <label
          htmlFor="zip_file"
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            width: 'full',
            height: 'full',
            cursor: 'pointer',
          }}
        >
          {' '}
          <Image src="/assets/images/blue_add.png" />
          <Text fontSize="xs" fontWeight="700">
            Add New HTML File
          </Text>
          <Input
            type="file"
            name="file"
            id="zip_file"
            accept=".html"
            onChange={handleFileReader}
          />
        </label>
      </Container>
    </Flex>
    <Box>
      {steps.map((step, index) => (
        <Container
          p={0}
          m={0}
          pt={8}
          maxW="none"
          key={Math.random()}
        >
          <Text fontWeight="700" mb={2}>{`Step ${index + 1}:`}</Text>
          {step.zip.data ? (
            <Flex
              bgColor="blue.50"
              w="max-content"
              h="26"
              m="3"
              gap="3"
              borderRadius="6px"
              align="center"
              justify="space-between"
              p="3"
            >
              <Image
                onClick={() => removeHtmlStep(index)}
                src="/assets/images/close.png"
                cursor="pointer"
              />
              <Editable
                onSubmit={(e) => changeFileName(e, index)}
                defaultValue={step.zip.fileName}
                color="blue.500"
              >
                <EditablePreview p={0} />
                <EditableInput />
              </Editable>
            </Flex>
          ) : (
            <Flex align="center" gap={5}>
              <Input
                placeholder="Enter URL"
                value={step.url.src}
                onChange={(e) => handleInputChange(e, index)}
              />
              <Image
                onClick={() => removeHtmlStep(index)}
                cursor="pointer"
                src="/assets/images/close.png"
              />
            </Flex>
          )}
        </Container>
      ))}
    </Box>
  </Container>
)
