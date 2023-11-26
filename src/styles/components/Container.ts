import type { ComponentStyleConfig } from '@chakra-ui/theme'
import { pagination } from './Pagination'

export const Container: ComponentStyleConfig = {
  variants: {
    pagination,
    file: {
      'input[type="file"]': {
        border: 0,
        visibility: 'hidden',
        h: 'full',
      },
      'input[type="file"]::before': {
        visibility: 'initial',
        content: '"Upload Image"',
        display: 'inline-block',
        p: 4,
        bg: 'blue.50',
        borderRadius: 16,
        color: 'gray.200',
        fontSize: 12,
        cursor: 'pointer',
      },
    },
    'manual-image': {
      p: 0,
      'input[type="file"]': {
        p: 0,
        border: 0,
        visibility: 'hidden',
        h: 'full',
      },
      'input[type="file"]::before': {
        border: '1px solid',
        borderColor: 'blue.500',
        visibility: 'initial',
        content: '"Upload"',
        display: 'inline-block',
        py: 3,
        px: 8,
        bg: 'main_white',
        borderRadius: 60,
        color: 'gray.200',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
      },
    },
    loaderWrapper: {
      h: 'full',
      w: 'full',
      maxW: 'auto',
      p: 0,
      m: 0,
    },
    zipFile: {
      position: 'relative',
      m: 0,
      bg: 'blue.50',
      borderRadius: 16,
      display: 'flex',
      justifyContent: 'center',
      width: 40,
      p: 0,
      h: 14,
      'input[type="file"]': {
        border: 0,
        visibility: 'hidden',
        h: 'full',
        position: 'absolute',
        opacity: 0,
      },
    },
    language: {
      justifyContent: 'space-between',
      display: 'flex',
      bgColor: 'blue.50',
      borderRadius: 50,
      w: 'fit-content',
      h: 49,
      m: 0,
      p: 0,
      py: 1,
    },
    uploadImage: {
      alignItems: 'center',
      justifyContent: 'space-between',
      bgColor: 'blue.50',
      p: 5,
      borderRadius: '16',
      maxW: '163',
      minH: '12',
      cursor: 'pointer',
      display: 'flex',
      m: '0',
    },
    dashedContainer: {
      display: 'flex',
      alignItems: 'center',
      border: '1px dashed',
      borderColor: 'gray.100',
      maxW: 'none',
      h: 8,
      my: 3,
      p: 0,
    },
    select: {
      p: 0,
      w: '2xl',
      maxW: 'none',
      zIndex: 9,
      position: 'relative',
      display: 'flex',
      flexDir: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      bg: 'white',
      border: '1px solid',
      borderColor: 'gray.50',
      borderRadius: 'md',
      ul: {
        borderColor: 'gray.50',
      },
    },
    default: {
      my: 3,
      px: '0',
      maxW: 'none',
      h: 8,
      border: '1px dashed transparent',
    },
    contentWrapper: {
      p: 0,
      m: 0,
      maxW: 'none',
      display: 'flex',
      flexDirection: 'column',
    },
    contentContainer: {
      display: 'flex',
      flexDir: 'row',
      m: '0',
      p: '0',
      maxW: 'none',
      h: 'full',
    },
    statusContainer: {
      m: 0,
      maxW: 'none',
      w: '36',
      bg: 'main_white',
      display: 'flex',
      gap: '2',
      p: '3',
      flexDirection: 'column',
      borderRadius: '8',
      boxShadow: '0px 4px 30px rgba(45, 52, 54, 0.1)',
    },
    menuItem: {
      color: 'gray.200 !important',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      borderRadius: '8px',
      justifyContent: 'start',
      gap: '10px',
      _hover: {
        bgColor: 'blue.50 !important',
      },
    },
  },
  defaultProps: {},
}