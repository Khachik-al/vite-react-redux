import { Flex, Td, Tr } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useMemo } from 'react'
import { CloneDevice } from '../../interfaces/data.interface'
import { useAppSelector } from '../../redux/hooks'

type Props = {
  device: CloneDevice
  handleDelete: (p: string) => void
}

export const CloneDevicesTableRow = ({ device, handleDelete }: Props) => {
  const { metadata } = useAppSelector((state) => state.metadata)
  const carrier = useMemo(
    () => metadata?.carriers?.find((c) => c.id === device.carrierId),
    [device.carrierId, metadata.carriers],
  )
  const language = useMemo(
    () => metadata?.languages?.find((c) => c.id === device.languageId),
    [device.carrierId, metadata.carriers],
  )

  return (
    <Tr>
      <Td>
        {device.referenceId}
      </Td>
      <Td>{carrier?.name || ''}</Td>
      <Td>{language?.name || ''}</Td>
      <Td>
        <Flex justifyContent="start">
          <EditIcon
            cursor="pointer"
            boxSize={4}
            mr={3}
          />
          <DeleteIcon
            onClick={() => handleDelete(device.referenceId)}
            cursor="pointer"
            boxSize={4}
          />
        </Flex>
      </Td>
    </Tr>
  )
}
