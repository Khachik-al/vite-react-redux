import { Categories, Faceplate } from './data.interface'
import { Language } from './features.interface'

export type Tutorial = {
  id?: string
  faceplate?: Faceplate
  productId: string
  type: Type | string
  customerIds: string[]
  categoryIds: CategoryIds[]
  isPublic: boolean
  title: string
  slug: string
  translations: Translations[]
}

export type PostTutorial = {
  productId: string
  type: Type | string
  customerIds: string[]
  categoryIds: string[]
  isPublic: boolean
  title: string
  slug?: string
  translations: Translations[]
}

export type UpdatedTutorial = {
  productId: string
  type: Type | string
  customerIds: string[]
  categoryIds: string[]
  isPublic: boolean
  title: string
  translations: Translations[]
}

export type CategoryIds = {
  id: string
  languageId: string
}

export type Translations = {
  languageId: string
  value: {
    title?: string
    text?: string
  }
}

export type ValidationForm = {
  slug: boolean
  type: boolean
  title: boolean
  device: boolean
  customer: boolean
}

export type Step = {
  isSubstep: boolean
  order: number
  orientation: 'portrait' | 'landscape'
  delay: number
  action: {
    type: NameTypeButton
    x: number
    y: number
    isOnScreen: boolean
  }
  text: string
  filePath: {
    file: File
    fileName: string
    fileImg: string
    id: string
  }
  translations: Translations[]
  isAnimatedStep?: boolean
  animation?: {
    order: number
    imagePath: string
    delay: number
  }[]
}

export type PostStep = {
  isSubstep: boolean
  order: number
  orientation?: 'portrait' | 'landscape'
  delay?: number
  action?: {
    type: NameTypeButton
    x: number
    y: number
    isOnScreen: boolean
  } | null
  text: string
  filePath: string
  translations: Translations[]
  isAnimatedStep?: boolean
  animation?: {
    order: number
    imagePath: string
    delay: number
  }[]
}

export type Type = 'Interactive' | 'HTML5'

export type Customer = {
  checked?: boolean
  name: string
  id: string
  shortname: string
}

export type Category = {
  name: string
  id: string
  language: Language
  checked?: boolean
}

export type TypeButtonText =
  | 'Automate'
  | 'Button'
  | 'Swipe up'
  | 'Swipe down'
  | 'Swipe left'
  | 'Swipe right'

export type TypeButton = {
  name: NameTypeButton
  text: TypeButtonText
}

export type NameTypeButton =
  | 'click'
  | 'swipe_up'
  | 'swipe_down'
  | 'swipe_left'
  | 'swipe_right'
  | 'automate'

export type StepBody = {
  isSubstep?: boolean
  order: number
  orientation: 'portrait' | 'landscape'
  delay: number
  action: {
    type: NameTypeButton
    x: number
    y: number
    isOnScreen: boolean
  }
  text: string
  filePath: string
  translations: Translations[]
  isAnimatedStep?: boolean
  animation?: {
    order: number
    imagePath: string
    delay: number
  }[]
}

export type TutorialTranslations = {
  id: string
  title: string
  language: Language
}

export type TutorialsData = {
  faceplate?: Faceplate
  categories: Categories[]
  customers: Customer[]
  id: string
  is_public: boolean
  product: { id: string; name: string }
  serial: number
  slug: string
  title: string
  translations: TutorialTranslations[]
  type: Type
}

export type StepTranslation = {
  id: string
  text: string
  language: Language
}

export type Steps = {
  action: {
    id: string
    type: string
    x: number
    y: number
    on_screen: boolean
  }
  animation: []
  delay: number
  file_path: string
  filePath?: any
  id: string
  is_animated_step: boolean
  is_substep: boolean
  order: number
  orientation: 'portrait' | 'landscape'
  text: string | null
  translations: StepTranslation[]
}

export type HtmlSteps = {
  url: {
    src: string
  }
  zip: {
    data: File | null
    fileName: string
    id?: number
  }
  isSubstep: boolean
  order: number
  text: string
  translations: Translations[]
}

export type PostHtmlStep = {
  isSubstep: boolean
  order: number
  text: string
  filePath: string
  translations: Translations[]
}
