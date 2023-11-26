import SunEditor from 'suneditor-react'
import SunEditorCore from 'suneditor/src/lib/core'
import 'suneditor/dist/css/suneditor.min.css'
import { useRef } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

type Props = {
  onClose: () => void
  isOpen: boolean
  onChange: (contents: string, lang: string) => void
  lang: string
  defaultValue: string
}

export const TextEditor = ({
  onClose,
  isOpen,
  onChange,
  lang,
  defaultValue,
}: Props) => {
  const editor = useRef<SunEditorCore>()
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent w="auto" maxW="70%" h="auto" maxH="2xl">
        <ModalHeader>Edit Text</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          sx={{
            div: {
              '.sun-editor-editable': {
                overflow: 'auto',
                maxH: ['xs', 'xs', 'xs', 'md'],
              },
            },
          }}
        >
          <SunEditor
            onSave={(contents) => onChange(contents, lang)}
            defaultValue={defaultValue}
            setDefaultStyle="font-size: 18px;"
            setOptions={{
              mode: 'classic',
              rtl: false,
              katex: 'window.katex',
              resizingBar: false,
              showPathLabel: false,
              resizeEnable: false,
              imageResizing: false,
              imageHeightShow: false,
              imageAlignShow: false,
              imageFileInput: false,
              imageUrlInput: false,
              videoResizing: false,
              videoHeightShow: false,
              videoAlignShow: false,
              videoFileInput: false,
              videoUrlInput: false,
              videoRatioShow: false,
              audioUrlInput: false,
              tabDisable: false,
              shortcutsHint: false,
              mediaAutoSelect: false,
              buttonList: [
                [
                  'undo',
                  'redo',
                  'font',
                  'fontSize',
                  'paragraphStyle',
                  'blockquote',
                  'bold',
                  'underline',
                  'italic',
                  'strike',
                  'subscript',
                  'fontColor',
                  'hiliteColor',
                  'removeFormat',
                  'outdent',
                  'indent',
                  'align',
                  'horizontalRule',
                  'list',
                  'lineHeight',
                  'table',
                  'link',
                  'math',
                  'codeView',
                  'print',
                  'save',
                ],
              ],
            }}
            placeholder="Enter Text..."
            getSunEditorInstance={getSunEditorInstance}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
