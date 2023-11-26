import { Language } from './feature.interface'

export type Customer = {
  id: string
  name: string
  shortname: string
  checked?: boolean
}

type DefaultType = { id: string, name: string }

type MetadataRole = {
  id: string
  name: string
  user_access: boolean
  customer_access: boolean
  product_view_access: boolean
  product_edit_access: boolean
  content_view_access: boolean
  content_edit_access: boolean
  publish_content_access: boolean
}

type Manufacturer = {
  id: string
  name: string
  image_url: string
}

export type Carrier = {
  id: string
  name: string
}

export type SelectedFile = {
  myFile: File | null
  fileName: string
}
export type Metadata = {
  roles?: MetadataRole[]
  languages: { id: string; name: Language, code: string }[]
  manufacturers?: Manufacturer[]
  productTypes?: DefaultType[]
  carriers?: DefaultType[]
}
