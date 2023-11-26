import { stringify } from '../../utils/queryString'
import type { SelectedFile, NewDevice } from '../../interfaces/data.interface'
import type {
  PostStep,
  PostTutorial,
} from '../../interfaces/tutorials.interface'

type Conf = {
  path: string
  method: string
}

type Params = {
  method: string
  headers: {
    Authorization: string
  }
  body?: string | null | undefined
}

type MetadataType =
  | 'roles'
  | 'languages'
  | 'manufacturers'
  | 'productTypes'
  | 'carriers'

export type Deps = {
  token: string
  body?: object
}

const base = import.meta.env.VITE_KMS_ADMIN_API_BASE_URL
const API_ASSETS = import.meta.env.VITE_KMS_ADMIN_API_ASSETS_URL

export const f = ({ path, method }: Conf) =>
  ({ token, body = {} }: Deps) =>
    (): Promise<unknown> => {
      const params: Params = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      if (method !== 'get') {
        params.body = JSON.stringify(body)
      }
      return fetch(`${base}${path}`, params)
    }

export const patchDeviceCustomers = ({
  body,
  token,
  id,
}: {
  body: { customerIds: string[] }
  token: string
  id: string
}) =>
  f({
    path: `/product/${id}`,
    method: 'PATCH',
  })({
    token,
    body,
  })

export const getCustomers = ({ token, p }: { token: string; p?: string }) =>
  f({
    path: `/customer${p ? `?shortname=${p}` : ''}`,
    method: 'get',
  })({
    token,
  })

export const fetchParentCategories = ({ token }: { token: string }) =>
  f({
    path: '/faq-category',
    method: 'get',
  })({
    token,
  })()

export const fetchChildCategories = (
  { token, parentId }: { token: string, parentId: string },
) =>
  f({
    path: `/faq-category/${parentId}`,
    method: 'get',
  })({
    token,
  })()

export const fetchMetadata = ({ token }: { token: string }) =>
  f({
    path: '/metadata',
    method: 'get',
  })({
    token,
  })

export const postCarrier = ({ token, name }: { token: string; name: string }) =>
  f({
    path: '/carrier',
    method: 'post',
  })({
    token,
    body: { name },
  })

export const getMetadata = ({
  par,
  token,
}: {
  par: MetadataType | MetadataType[]
  token: string
}) => {
  const getQuery = () => {
    if (typeof par === 'string') {
      return par
    }
    return par.join('=true&')
  }
  const queries = getQuery()
  return f({ method: 'get', path: `/metadata?${queries}=true` })({
    token,
    body: {},
  })
}

export const getImageUrl = ({
  token,
  p,
}: {
  token: string
  p: Record<string, string>
}) =>
  f({
    path: `/assets/upload-url?${stringify(p)}`,
    method: 'get',
  })({
    token,
  })

export const putBinary = (url: string, data: File | null) =>
  fetch(`${url}`, {
    method: 'put',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'binary/octet-stream',
    },
    body: data,
  })

export const postManufacturer = ({ token, p }: { token: string; p: Object }) =>
  f({
    path: '/product-manufacturer',
    method: 'post',
  })({
    token,
    body: p,
  })

export const patchCloneDevice = (
  { token, body, id } : { token: string, body: Object, id: string },
) =>
  f({
    path: `/product/reference/${id}`,
    method: 'PATCH',
  })({
    token,
    body,
  })()

export const getProductById = ({ token, id }: { token: string; id: string }) =>
  f({
    path: `/product/${id}`,
    method: 'get',
  })({
    token,
  })

export const postDevice = ({
  token,
  device,
}: {
  token: string
  device: NewDevice
}) =>
  f({
    path: '/product',
    method: 'post',
  })({
    token,
    body: device,
  })

export const postAsset = async (
  token: string,
  selectedFile: SelectedFile,
): Promise<string> => {
  const uploadResponse: any = await getImageUrl({
    token,
    p: {
      directory: `product-assets/${selectedFile.filename}`,
      objectName: `${selectedFile.filename}`,
    },
  })()

  const uploadUrl = await uploadResponse.json()

  await putBinary(uploadUrl.data.uploadUrl, selectedFile.myFile)

  return `${API_ASSETS}/${uploadUrl.data.key}`
}

export const updateAssets = ({
  token,
  body,
}: {
  token: string
  body: Record<string, any>
}) =>
  f({
    path: '/product/assets',
    method: 'PUT',
  })({
    token,
    body,
  })

export const updateReferenceAssets = ({
  token,
  body,
  id,
}: {
  token: string
  body: Record<string, any>
  id: string
}) =>
  f({
    path: `/product/reference/${id}/documents`,
    method: 'PUT',
  })({
    token,
    body,
  })

export const postProductCopy = ({ token, id }: { token: string, id: string }) =>
  f({
    path: `/product/${id}/copy`,
    method: 'POST',
  })({
    token,
  })()

export const patchParentDevice = (
  { token, id, body }: { token: string, id: string, body: Record<string, any> },
) =>
  f({
    path: `/product/${id}`,
    method: 'PATCH',
  })({
    token,
    body,
  })()

export const getCategories = ({ token }: { token: string }) =>
  f({
    path: '/tutorial-category',
    method: 'get',
  })({
    token,
  })

export const postCategory = ({
  token,
  body,
}: {
  token: string
  body: { languageId: string; name: string }
}) => {
  const res = f({
    path: '/tutorial-category',
    method: 'post',
  })({
    token,
    body,
  })
  return res
}
export const deleteCategory = ({ token, id }: { token: string; id?: string }) =>
  f({
    path: `/tutorial-category/${id}`,
    method: 'delete',
  })({
    token,
  })

export const postTutorial = ({
  token,
  body,
}: {
  token: string
  body: PostTutorial
}) =>
  f({
    path: '/tutorial',
    method: 'post',
  })({
    token,
    body,
  })

export const postStepTutorial = ({
  token,
  body,
  id,
}: {
  token: string
  body: PostStep[]
  id: string
}) =>
  f({
    path: `/tutorial/${id}/steps`,
    method: 'put',
  })({
    token,
    body,
  })

export const updateTutorial = ({
  token,
  body,
  id,
}: {
  token: string
  body: PostTutorial
  id: string
}) =>
  f({
    path: `/tutorial/${id}`,
    method: 'PATCH',
  })({ token, body })

export const searchProductByQuery = ({ token, q }: { token: string, q: string }) =>
  f({
    path: `/search/${q}`,
    method: 'get',
  })({
    token,
  })

export const patchReferenceCustomers = (
  { token, body, id }: { token: string, body: Record<string, any>, id: string },
) =>
  f({
    path: `/product/reference/${id}`,
    method: 'PATCH',
  })({
    token,
    body,
  })()
