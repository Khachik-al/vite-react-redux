import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from '@chakra-ui/react'
import { ChangeEvent } from 'react'
import { AddParentDevicePanel, ParentDevice } from './AddParentDevicePanel'
import { AddCloneDevicePanel } from './AddCloneDevicePanel'
import { CloneDevice } from '../../interfaces/data.interface'

type Props = {
  selectedFile: {
    myFile: File | null
    fileName: string
  }
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void
  deleteSelectedFile: () => void
  setCloneDevices: (p: CloneDevice[]) => void
  cloneDevices: CloneDevice[]
  parentDevice: ParentDevice
  setParentDevice: (p: ParentDevice) => void
}

export const AddDeviceAccordion = ({
  selectedFile,
  handleFileUpload,
  deleteSelectedFile,
  cloneDevices,
  setCloneDevices,
  parentDevice,
  setParentDevice,
}: Props) => (
  <>
    <AccordionItem
      mb={4}
      border="1px solid lightgray"
      borderRadius={16}
      p={0}
      bg="main_white"
    >
      <Flex justifyContent="space-between" p={4}>
        <Box
          flex="1"
          textAlign="left"
          fontWeight={600}
          fontSize={16}
          lineHeight={8}
        >
          Parent Device
        </Box>
        <AccordionButton
          _hover={{ bg: 'blue.400' }}
          w="inherit"
          bg="blue.500"
          p={2}
          borderRadius={8}
        >
          <AccordionIcon color="main_white" />
        </AccordionButton>
      </Flex>
      <AccordionPanel pb={4}>
        <AddParentDevicePanel
          selectedFile={selectedFile}
          handleFileUpload={handleFileUpload}
          deleteSelectedFile={deleteSelectedFile}
          parentDevice={parentDevice}
          setParentDevice={setParentDevice}
        />
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem
      border="1px solid lightgray"
      borderRadius={16}
      p={0}
      bg="main_white"
    >
      <Flex justifyContent="space-between" p={4}>
        <Box
          flex="1"
          textAlign="left"
          fontWeight={600}
          fontSize={16}
          lineHeight={8}
        >
          Clone Device
        </Box>
        <AccordionButton
          _hover={{ bg: 'blue.400' }}
          w="inherit"
          bg="blue.500"
          p={2}
          borderRadius={8}
        >
          <AccordionIcon color="main_white" />
        </AccordionButton>
      </Flex>
      <AccordionPanel pb={4}>
        <AddCloneDevicePanel
          setCloneDevices={setCloneDevices}
          cloneDevices={cloneDevices}
        />
      </AccordionPanel>
    </AccordionItem>
  </>
)
