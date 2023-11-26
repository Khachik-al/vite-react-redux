import type { ComponentStyleConfig } from '@chakra-ui/theme'

export const Menu: ComponentStyleConfig = {
  variants: {
    multiselect: {
      button: {
        border: '1px solid',
        borderColor: 'gray.50',
        fontSize: 14,
        color: 'gray.200',
        borderRadius: 'md',
        mb: 0,
        w: 'full',
        py: 2,
        pl: 4,
        pr: 2.5,
        alignItems: 'start',
        _focus: {
          borderColor: 'blue.500',
          boxShadow: 'none',
          zIndex: 0,
        },
      },
      list: {
        w: 'full',
        p: 0,
        mt: 0,
        borderRadius: 0,
        borderColor: 'gray.200',
        maxH: 200,
        overflowY: 'auto',
      },
      item: {
        p: 0,
        pl: 1,
        _hover: {
          bg: 'blue.500',
          color: 'main_white',
        },
        _focus: {
          bg: 'blue.500',
          color: 'main_white',
        },
      },
    },
  },
  defaultProps: {
    variant: 'outline',
  },
}
