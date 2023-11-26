import { f } from './index'
import { FaqBody } from '../../interfaces/faq.interface'

export const postFaq = ({ token, body }: { token: string, body: Record<string, any> }) =>
  f({
    path: '/faq',
    method: 'POST',
  })({
    token,
    body,
  })()

export const postCategory = ({ token, body }: { token: string, body: Record<string, any> }) =>
  f({
    path: '/faq-category',
    method: 'POST',
  })({
    token,
    body,
  })()

export const getFaqById = ({ token, id }: { token: string, id: string }) =>
  f({
    path: `/faq/${id}`,
    method: 'get',
  })({
    token,
  })()

export const patchFaqById = (
  { token, id, body }: { token: string, id: string, body: FaqBody },
) =>
  f({
    path: `/faq/${id}`,
    method: 'PATCH',
  })({
    token,
    body,
  })()
