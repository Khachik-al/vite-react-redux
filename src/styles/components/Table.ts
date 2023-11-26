import type { ComponentStyleConfig } from '@chakra-ui/theme'

export const Table: ComponentStyleConfig = {
  baseStyle: {},
  variants: {
    basic: {
      td: {
        borderBottom: '1px solid',
        borderColor: 'blue.50',
        color: 'gray.200',
      },
    },
  },
}
