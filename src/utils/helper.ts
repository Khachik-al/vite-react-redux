import { CloneDevice, Reference } from '../interfaces/data.interface'
import { FaqProduct } from '../interfaces/faq.interface'

export const mapToCloneDeivce = (arr: Reference[]): CloneDevice[] => arr.map((elem) => ({
  id: elem.id,
  referenceId: elem.reference_id,
  customers: elem.customers.map((c) => ({
    id: c.customer.id,
    slug: c.slug,
  })),
  carrierId: elem.carrier.id,
  languageId: elem.language.id,
  vanityName: elem.vanity_name || '',
}))

export const mapFaqProducts = (arr: FaqProduct[]) => arr.map((elem) => ({
  id: elem.product.id,
  customerIds: elem.customers.map((c) => c.id),
  name: elem.product.name,
}))

export const normalizeSpaces = (string: string) =>
  string.replace(/\s+/g, ' ').trim()

export const returnFilterObject = (filters: Record<string, any>) => {
  const result = (Object.keys(filters) as (keyof typeof filters)[])
    .reduce((obj: Partial<typeof filters>, key) => {
      const o = { ...obj }
      if (filters[key]) {
        o[key] = filters[key]
      }
      return o
    }, {})

  return result
}
