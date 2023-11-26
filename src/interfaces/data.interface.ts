import { Language } from './features.interface'
import { Customer } from './metadata.interface'

export type DeviceList = {
  id: string
  reference_id: string
  reference_type: string
  product_key: number
  vanity_name: string
  customers?: [
    {
      id: string
      name: string
      shortname: string
    },
  ]
  documents: {
    booklet: string
    id: string
    main_image: string
    manual: string
  } | null
  product: {
    id: string
    name: string
    manufacturer: {
      id: string
      name: string
      image_url: string
    }
    customers: Customer[],
    faceplate?: Faceplate
  }
}

export type Product = {
  deviceList: DeviceList
  count: number
}

export type Faceplate = {
  id: string
  is_behind: boolean
  landscape_height: number
  landscape_image: string
  landscape_width: number
  landscape_x: number
  landscape_y: number
  portrait_height: number
  portrait_image: string
  portrait_width: number
  portrait_x: number
  portrait_y: number
}

export type NewDevice = {
  referenceId: string
  customerIds: string[]
  name: string
  typeId: string
  manufacturerId: string
  carrierId: string
  references: CloneDevice[]
}

export type CloneDevice = {
  id?: string
  referenceId: string
  customers: {
    id: string
    slug: string
  }[]
  carrierId: string
  languageId: string
  vanityName: string
}

export const isProduct = (p: any): p is Product =>
  'reference_id' in p
  && 'reference_type' in p
  && 'product' in p
  && typeof p.product === 'object'
  && 'name' in p.product
  && 'manufacturer' in p.product
  && typeof p.product.manufacturer === 'object'
  && 'name' in p.product.manufacturer
  && 'image_url' in p.product.manufacturer

type DataRes = { data: unknown }
export const isDataRes = (a: any): a is DataRes => 'data' in a

export type SingleProduct = {
  id: string
  reference_id: string
  reference_type: string
  customers: {
    slug: string
    id: string
    customer: {
      id: string
      name: string
      shortname: string
    }
  }[]
  vanity_name: string
  serial: number
  carrier: {
    id: string
    name: string
  }
  language: {
    id: string
    name: string
  }
  documents: {
    id: string
    main_image: string
    manual: string
    booklet: string
  }
  product: {
    id: string
    name: string
    type: {
      id: string
      name: string
    }
    manufacturer: {
      id: string
      image_url: string
      name: string
    }
    references: Reference[]
    faceplate: {
      id: string
      is_behind: boolean
      portrait_image: string
      portrait_x: number
      portrait_y: number
      portrait_width: number
      portrait_height: number
      landscape_image: string
      landscape_x: number
      landscape_y: number
      landscape_width: number
      landscape_height: number
    }
    customers: {
      id: string
      name: string
      shortname: string
    }[]
  }
}

export type Reference = {
  carrier: {
    id: string
    name: string
  }
  customers: {
    id: string
    name: string
    shortname: string
    slug: string
    customer: {
      id: string
      name: string
      shortname: string
    }
  }[]
  language: {
    id: string
    name: string
  }
  reference_id: string
  reference_type: string
  serial: number
  vanity_name: string | null
  id: string
  slug: string
}

export type SelectedFile = {
  myFile: File | null
  filename: string
}

export type Coords = {
  x: number
  y: number
  width: number
  height: number
}

export type Categories = {
  checked?: boolean, id: string; name: string; language: Language
}

export type ContentType = 'faq' | 'tutorial'
export type Content = {
  category: string
  full_title: string
  id: string
  manufacturer: string
  product_name: string
  status: boolean
  type: ContentType
}

export type ContentRes = {
  content: Content[],
  count: number
}

export interface ResponseType<T = unknown> {
  json: () => Promise<{
    data: T
    message: string
    error: {
      message: string
    }
  }>
  ok: boolean
}

export interface ResponseMessage {
  json: () => Promise<{
    message: string
    error?: string
  }>
  ok: boolean
}
