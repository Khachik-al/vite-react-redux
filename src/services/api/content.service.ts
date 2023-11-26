import { f } from './index'

export const getTutorial = ({ token, id }: { token: string, id: string }) =>
  f({ method: 'get', path: `/tutorial/${id}` })({ token, body: {} })

export const getTutorialSteps = ({ token, id }: { token: string, id: string }) =>
  f({ method: 'get', path: `/tutorial/${id}/steps` })({ token })
