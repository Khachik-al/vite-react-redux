import type { ComponentStyleConfig } from '@chakra-ui/theme'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'
import defaultTheme from '@chakra-ui/theme'

export const Select: ComponentStyleConfig = {
  variants: {
    outline: (props: StyleFunctionProps) => ({
      ...defaultTheme?.components?.Select?.variants?.outline(props),
      field: {
        ...defaultTheme?.components?.Select?.variants?.outline(props).field,
        border: '1px solid',
        borderColor: 'gray.50',
        width: '100%',
        color: 'gray.200',
        fontSize: 14,
        option: {
          color: 'main_black',
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
