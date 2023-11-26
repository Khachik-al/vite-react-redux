export type ParentCategory = {
  id: string
  name: string
  language: {
    id: string
    name: string
  }
}

export type ChildCategory = {
  id: string
  name: string
  language: {
    id: string
    name: string
  }
  category: ParentCategory
  translations: {
    name?: string
    language: {
      id: string
      name: string
    }
  }[]
}

export type LanguageObject = {
  id: string
  name: string
}

export type Translation = {
  title: string
  answer: string
  language: {
    id: string
    name: string
  }
}

export type TranslationBody = {
  languageId: string
  name: string
}

export type CategoryTranslation = {
  id: string
  name: string
  language: {
    id: string
    name: string
  }
}

export type SingleFaq = {
  id: string
  translations: Translation[]
  child_category: {
    id: string
    name: string
    translations: CategoryTranslation[]
    category: {
      id: string
      name: string
      translations: CategoryTranslation[]
    }
  }
  is_public: boolean,
  title: string
  answer: string
  faqsProducts: FaqProduct[]
  serial: number
}

export type FaqProduct = {
  slug: string
  customers: {
    id: string
    name: string
    shortname: string
  }[]
  faqId: string
  product: {
    id: string
    name: string
  }
}

export type FaqBody = {
  products: {
    id: string
    customerIds: string[]
  }[],
  translations: Translation[],
  isPublic: boolean
  title: string
  answer: string
  childCategoryId: string
  slug?: string
}
