import type { ComponentStyleConfig } from '@chakra-ui/theme'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'
import defaultTheme from '@chakra-ui/theme'

export const Input: ComponentStyleConfig = {
  variants: {
    outline: (props: StyleFunctionProps) => ({
      ...defaultTheme?.components?.Input?.variants?.outline(props),
      field: {
        ...defaultTheme?.components?.Input?.variants?.outline(props).field,
        border: '1px solid',
        fontSize: 14,
        borderColor: 'gray.50',
        _placeholder: { color: 'gray.200' },
        _disabled: {
          bg: 'blue.50',
          color: 'gray.200',
          opacity: 1,
        },
        _focus: {
          borderColor: 'blue.500',
          boxShadow: 'none',
          zIndex: 0,
        },
      },
    }),
  },
  defaultProps: {
    variant: 'outline',
  },
}
