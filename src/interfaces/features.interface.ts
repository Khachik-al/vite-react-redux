export type Language = {
  code: string,
  name: 'English' | 'Formal Spanish' | 'Informal Spanish' | 'Spanish'
  id: string
}

export type DataFeatures = {
  features: Feature[]
  techSpecs: Feature[]
  accessories: Feature[]
}

export type Features = {
  feature: Feature[]
  tech_spec: Feature[]
  accessory: Feature[]
}

export type Feature = {
  id: string
  name: string
  language: Language
  value: string
  featureType?: FeatureType
  changed?: boolean
}

export type FeaturePayload = {
  id?: string | undefined
  name?: string
  languageId?: string
  value?: string
  featureType: FeatureType
  parentProductId?: string
  featureId?: string
}

export type FeatureType = 'tech_spec' | 'accessory' | 'feature'
