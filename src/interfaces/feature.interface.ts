export type Language = 'English' | 'Formal Spanish' | 'Informal Spanish'

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
  language: { id: string; name: string }
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

export type FetchFeatures = {
  method: 'get' | 'post' | 'patch' | 'delete' | 'PATCH'
  token: string
  body: {}
}
