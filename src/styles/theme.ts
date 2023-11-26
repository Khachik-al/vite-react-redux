import { extendTheme } from '@chakra-ui/react'
import { Text } from './components/Text'
import { Input } from './components/Input'
import { Button } from './components/Button'
import { Table } from './components/Table'
import { Container } from './components/Container'
import { Select } from './components/Select'
import { Menu } from './components/Menu'
import { Heading } from './components/Heading'
import '@fontsource/inter'

export const theme = extendTheme({
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  styles: {
    global: {
      body: {
        bg: 'main_white',
        color: 'main_black',
        fontSize: 14,
        h: '100%',
      },
      '::-webkit-scrollbar': {
        width: '10px',
        height: '4px',
      },
      '::-webkit-scrollbar-track': {
        background: 'gray.50',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'blue.500',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'blue.400',
      },
      html: {
        overflow: 'hidden',
        h: '100%',
      },
      '#root': {
        w: '100%',
        h: '100%',
      },
      button: {
        _hover: {
          filter: 'grayscale(41%) saturate(71%)',
          _disabled: { filter: 'saturate(0%)' },
        },
      },
    },
  },
  colors: {
    main_black: '#2D3436',
    gray: {
      50: '#DFE6E9',
      100: '#B2BEC3',
      200: '#636E72',
    },
    green: {
      500: '#38DE66',
    },
    yellow: '#FDBB30',
    lightest_blue: '#EEF4F7',
    main_white: '#FCFCFC',
    blue: {
      50: '#EEF4F7',
      100: '#C7DDEE',
      200: '#A8CDEA',
      300: '#79B9EA',
      400: '#55A8E8',
      500: '#0984E3',
      600: '#0A69B3',
      700: '#0A5894',
      800: '#084675',
      900: '#063559',
    },
  },
  components: {
    Text,
    Input,
    Button,
    Table,
    Container,
    Select,
    Menu,
    Heading,
  },
})
