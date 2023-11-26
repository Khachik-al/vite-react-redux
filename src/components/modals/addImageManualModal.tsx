import {
  Button, HStack,
  Modal, Box, Text,
  ModalBody, ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useState } from 'react'
import { DeviceImageStep } from '../addImageManualSteps/deviceImageStep'
import { Coordinates } from '../addImageManualSteps/coordinates'
import { Faceplate } from '../addImageManualSteps/faceplate'
import { useAppDispatch } from '../../redux/hooks'
import { useNotifications } from '../../hooks/useNotifications'
import { getSingleDevice, saveDeviceAssets } from '../../redux/slices/products'
import { Coords } from '../../interfaces/data.interface'

type Props = {
  onClose: () => void
  isOpen: boolean
  isParent: boolean
  mainImage: string
  portraitImage: string
  landscapeImage: string
  portrait: Coords
  landscape: Coords
  productId: string
  id: string
  referenceId: string
}

type FileState = {
  myFile: File | null
  filename: string
}

export const AddImageManualModal = ({
  onClose,
  isOpen,
  isParent,
  mainImage,
  portraitImage,
  landscapeImage,
  portrait,
  landscape,
  productId,
  id,
  referenceId,
}: Props) => {
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const dispatch = useAppDispatch()
  const [deviceImage, setDeviceImage] = useState<FileState>({
    myFile: null,
    filename: '',
  })
  const [portraitFaceplate, setPortraitFaceplate] = useState<FileState>({
    myFile: null,
    filename: '',
  })
  const [landscapeFaceplate, setLandscapeFaceplate] = useState<FileState>({
    myFile: null,
    filename: '',
  })
  const [portraitCoords, setPortraitCoords] = useState<Coords>({
    x: portrait.x || 70,
    y: portrait.y || 70,
    width: portrait.width || 80,
    height: portrait.height || 80,
  })
  const [landscapeCoords, setLandscapeCoords] = useState<Coords>({
    x: landscape.x || 70,
    y: landscape.y || 70,
    width: landscape.width || 80,
    height: landscape.height || 80,
  })
  const [currentStep, setCurrentStep] = useState(1)
  const steps = isParent ? [1, 2, 3, 4, 5] : [1]

  const reset = () => {
    setLandscapeFaceplate({
      myFile: null,
      filename: '',
    })
    setPortraitFaceplate({
      myFile: null,
      filename: '',
    })
    setDeviceImage({
      myFile: null,
      filename: '',
    })
    setPortraitCoords({
      x: portrait.x || 70,
      y: portrait.y || 70,
      width: portrait.width || 80,
      height: portrait.height || 80,
    })
    setLandscapeCoords({
      x: landscape.x || 70,
      y: landscape.y || 70,
      width: landscape.width || 80,
      height: landscape.height || 80,
    })
    setCurrentStep(1)
  }

  const handleBackButton = () => {
    if (currentStep === 1) {
      onClose()
      return
    }
    setCurrentStep(currentStep - 1)
  }

  const handleSave = async () => {
    const dataAssets = {
      device: deviceImage.myFile
        ? deviceImage
        : mainImage,
      portrait: portraitFaceplate.myFile
        ? portraitFaceplate
        : portraitImage,
      landscape: landscapeFaceplate.myFile
        ? landscapeFaceplate
        : landscapeImage,
      isParent,
      productId,
      referenceId,
      portraitCoords,
      landscapeCoords,
    }

    const resultAction = await dispatch(saveDeviceAssets(dataAssets))

    if (saveDeviceAssets.fulfilled.match(resultAction)) {
      const data = resultAction.payload
      showSuccessMessage(data.message)
      dispatch(getSingleDevice(id))
    } else if (saveDeviceAssets.rejected.match(resultAction)) {
      const data = resultAction.payload
      showErrorMessage(data || 'Could not upload asset.')
      reset()
    }
  }

  const handleNextButton = () => {
    if (currentStep === steps[steps.length - 1]) {
      handleSave()
      onClose()
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const handleSkip = () => setCurrentStep(currentStep + 1)

  const stepColor = (step: number) => {
    if (step === currentStep) return 'blue.500'
    if (step < currentStep) return 'blue.300'
    return 'gray.50'
  }

  const StepEnum = [
    <DeviceImageStep
      imageUrl={mainImage.split('?')[0]}
      selectedFile={deviceImage}
      setSelectedFile={setDeviceImage}
    />,
    <Faceplate
      type="portrait"
      imageUrl={portraitImage.split('?')[0]}
      selectedFile={portraitFaceplate}
      setSelectedFile={setPortraitFaceplate}
    />,
    <Faceplate
      type="landscape"
      imageUrl={landscapeImage.split('?')[0]}
      selectedFile={landscapeFaceplate}
      setSelectedFile={setLandscapeFaceplate}
    />,
    <Coordinates
      key={1}
      coords={portraitCoords}
      imageUrl={portraitImage.split('?')[0]}
      setCoords={setPortraitCoords}
      type="portrait"
      selectedFile={portraitFaceplate}
    />,
    <Coordinates
      key={2}
      coords={landscapeCoords}
      imageUrl={landscapeImage.split('?')[0]}
      setCoords={setLandscapeCoords}
      type="landscape"
      selectedFile={landscapeFaceplate}
    />,
  ]

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent my={3} maxW="none" w="fit-content">
        <ModalHeader fontSize={18}>Add Device Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text
              mb={1}
              fontWeight={600}
              color="gray.200"
            >
              {`Step ${currentStep} of ${steps.length}`}
            </Text>
            <HStack spacing={2} w="100%">
              {
                steps.map((step) => (
                  <Box
                    key={step}
                    bg={stepColor(step)}
                    w="100%"
                    h={1}
                    borderRadius={10}
                  />
                ))
              }
            </HStack>
          </Box>
          <Box>
            {
              StepEnum[currentStep - 1]
            }
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack>
            {currentStep !== steps[steps.length - 1] && (
              <Button
                bg="transparent"
                color="gray.200"
                _hover={{}}
                onClick={handleSkip}
              >
                Skip
              </Button>
            )}
            <Button
              py={4}
              px={8}
              color="gray.200"
              borderColor="gray.200"
              onClick={handleBackButton}
              variant="secondary_button"
            >
              {currentStep === 1 ? 'Close' : 'Back'}
            </Button>
            <Button
              py={4}
              px={8}
              onClick={handleNextButton}
            >
              {currentStep !== steps[steps.length - 1] ? 'Next Step' : 'Finish'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
