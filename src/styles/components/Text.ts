import type { ComponentStyleConfig } from '@chakra-ui/theme'

export const Text: ComponentStyleConfig = {
  baseStyle: {},
  sizes: {
    xs: {
      fontSize: '10',
    },
    sm: {
      fontSize: '12',
    },
    md: {
      fontSize: '14',
    },
    lg: {
      fontSize: '18',
    },
  },
  variants: {
    input_label: {
      fontWeight: 600,
      mb: 2,
    },
    link: {
      _hover: {
        textDecoration: 'underline',
      },
      cursor: 'pointer',
    },
    form_header: {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: 7,
    },
    required_field: {
      color: 'blue.500',
    },
  },
}
