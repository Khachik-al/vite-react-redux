import { Text } from '@chakra-ui/react'

export const RequiredMark = ({ isRemind }: { isRemind: boolean }) =>
  (
    <>
      <Text variant="required_field"> *</Text>
      {isRemind && (
      <Text ml="2" color="red" fontSize="xs" fontWeight="light">
        required
      </Text>
      )}
    </>
  )
