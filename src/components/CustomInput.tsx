import {
  Flex, Heading, Input,
} from '@chakra-ui/react'
import { RequiredMark } from './RequiredMark'

type Props = {
  headingText: string
  placeholder: string
  value: string
  onChange: ({ target }: { target: { value: string } }) => void
  isRequired: { isRequiredChild: boolean, isNotification: boolean }
  onBlur: () => void
}

export const CustomInput = ({
  headingText,
  placeholder,
  value,
  onChange,
  isRequired,
  onBlur = () => null,
}: Props) => (
  <Flex flexDir="column" w="full" onBlur={onBlur}>
    <Heading as="h3" variant="title" alignItems="center">
      {headingText}
      {isRequired && (
        <RequiredMark
          isRemind={isRequired.isNotification}
        />
      )}
    </Heading>
    <Input
      placeholder={placeholder}
      h={14}
      value={value}
      onChange={onChange}
      _placeholder={{ fontSize: 'md' }}
    />
  </Flex>
)
