import { FetchFeatures } from '../../interfaces/feature.interface'
import { f } from './index'

export const getFeaturesData = ({
  token,
  productId,
  languageId,
}: {
  token: string
  productId: string
  languageId: string
}) =>
  f({
    path: `/product/${productId}/features/?languageId=${languageId}`,
    method: 'get',
  })({
    token,
  })

export const fetchFeaturesData = ({
  method, token, body,
}: FetchFeatures) => f({
  path: '/product/feature',
  method,
})({
  token,
  body,
})
