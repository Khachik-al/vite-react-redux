import {
  Container, Flex, Heading, Image, Input,
} from '@chakra-ui/react'
import { FeatureType } from '../../../interfaces/feature.interface'

type Props = {
  specsValue: string | undefined
  value: string | undefined
  setValue: ({
    value,
    type,
    name,
    id,
  }: {
    value?: string
    type: FeatureType
    id: string
    name?: string
  }) => void
  removeFeature: ({ type, id }: { type: FeatureType; id: string }) => void
  id: string
}

export const TechnicalSpecsField = ({
  specsValue,
  value,
  setValue,
  removeFeature,
  id,
}: Props) => (
  <Container
    justifyContent="space-between"
    pos="relative"
    display="flex"
    role="group"
    maxW="auto"
    p={0}
  >
    <Image
      src="assets/images/close.svg"
      opacity={0}
      pos="absolute"
      right="0"
      cursor="pointer"
      onClick={() => removeFeature({ type: 'tech_spec', id })}
      _hover={{ opacity: 1 }}
      _groupHover={{ opacity: 1 }}
    />
    <Flex alignItems="flex-start" flexDir="column" gap={5}>
      <Heading as="h3" fontSize="md" fontWeight="normal">
        Specs
      </Heading>
      <Input
        value={specsValue}
        onChange={({ target }) => setValue({
          id, type: 'tech_spec', name: target.value, value,
        })}
      />
    </Flex>
    <Flex alignItems="flex-start" flexDir="column" gap={5}>
      <Heading as="h3" fontSize="md" fontWeight="normal">
        Value
      </Heading>
      <Input
        placeholder="Value"
        value={value}
        onChange={({ target }) => setValue({
          id, type: 'tech_spec', value: target.value, name: specsValue,
        })}
      />
    </Flex>
  </Container>
)
