import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit'
import {
  f,
  getMetadata,
  postAsset,
  postDevice,
  updateAssets,
  getProductById,
  patchCloneDevice,
  updateReferenceAssets,
  patchParentDevice,
  searchProductByQuery,
  patchReferenceCustomers,
  postProductCopy,
} from '../../services/api'
import type { ProductsState } from '../../interfaces/store.interface'
import type { RootState } from '../store'
import type {
  NewDevice,
  Product,
  Coords,
  SelectedFile,
  SingleProduct,
  Categories, ResponseType,
} from '../../interfaces/data.interface'
import { stringify } from '../../utils/queryString'
import { getAllCategories } from '../../services/api/product.service'

type SaveAsset = {
  device: SelectedFile | string
  landscape: SelectedFile | string
  portrait: SelectedFile | string
  isParent: boolean
  productId: string
  referenceId: string
  portraitCoords: Coords
  landscapeCoords: Coords
}

const initialState: ProductsState = {
  devices: {
    deviceList: [],
    count: 0,
  },
  currentDevice: {
    device: null,
    loading: false,
  },
  languages: [],
  error: {},
  assets: {
    message: '',
    error: '',
  },
  categories: [],
}

export const editCloneDevice = createAsyncThunk<
Promise<any>,
{ form: Object, id: string },
{ rejectValue: SerializedError }
>(
  'products/clonedevices/patch',
  async ({ form, id }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } }
      await patchCloneDevice({
        token: auth.token,
        body: form,
        id,
      })
    } catch (e) {
      rejectWithValue(e as SerializedError)
    }
  },
)

export const getDevices = createAsyncThunk<
{ data: { products: Product['deviceList'][], count: number } },
Record<string, string> | undefined,
{ rejectValue: SerializedError }
>('products/devices/get', async (queries, thunkApi) => {
  const { getState, rejectWithValue } = thunkApi
  try {
    const { auth } = getState() as { auth: { token: string } }
    const path = !queries ? '/product' : `/product?${stringify(queries)}`
    const res = f({ path, method: 'get' })({
      token: auth.token,
    })
    const data: any = await res()
    return data.json()
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const getSingleDevice = createAsyncThunk<
{ data: SingleProduct },
string,
{ rejectValue: SerializedError }
>('products/get/singleproduct', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as { auth: { token: string } }

    const res = await getProductById({ token: auth.token, id })
    const data: any = await res()
    return (await data.json()) as { data: SingleProduct }
  } catch (e) {
    return rejectWithValue(e as SerializedError)
  }
})

export const addDevice = createAsyncThunk<
{ message: string; error?: string },
NewDevice,
{ rejectValue: SerializedError }
>('products/devices/post', async (newDevice, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as { auth: { token: string } }
    const res = postDevice({ token: auth.token, device: newDevice })
    const data: any = await res()
    const result = await data.json()

    return result
  } catch (e) {
    return rejectWithValue(e as SerializedError)
  }
})

export const saveDeviceAssets = createAsyncThunk<
{ message: string; error: string },
SaveAsset,
{ rejectValue: string }
>(
  'products/device/saveassets',
  async (dataAssets, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } }
      const {
        device,
        portrait,
        landscape,
        isParent,
        productId,
        referenceId,
        portraitCoords,
        landscapeCoords,
      } = dataAssets

      const mainImage = typeof device === 'string'
        ? device
        : await postAsset(auth.token, device)

      if (isParent) {
        const portraitImage = typeof portrait === 'string'
          ? portrait
          : await postAsset(auth.token, portrait)
        const landscapeImage = typeof landscape === 'string'
          ? landscape
          : await postAsset(auth.token, landscape)

        const assets = {
          productId,
          documents: {
            mainImage,
          },
          faceplate: {
            isBehind: true,
            portrait: {
              image: portraitImage,
              coords: portraitCoords,
            },
            landscape: {
              image: landscapeImage,
              coords: landscapeCoords,
            },
          },
        }

        const resp: any = await updateAssets({
          token: auth.token,
          body: assets,
        })()
        const data = await resp.json()
        return { message: data.message, error: data.error || '' }
      }
      const referenceAssets = {
        mainImage,
      }

      const resp: any = await updateReferenceAssets({
        token: auth.token,
        body: referenceAssets,
        id: referenceId,
      })()
      const data = await resp.json()
      return { message: data.message, error: data.error || '' }
    } catch (e) {
      return rejectWithValue(e as string)
    }
  },
)

export const updateDocumentAsset = createAsyncThunk<
{ message: string; error: string },
{ type: string; url: string; productId: string },
{ rejectValue: SerializedError; state: RootState }
>(
  'device/document/update',
  async (dataAsset, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const assets = {
        productId: dataAsset.productId,
        documents: {
          [dataAsset.type]: dataAsset.url,
        },
      }

      if (dataAsset.type === 'parent') {
        const resp: any = await updateAssets({ token: auth.token, body: assets })()
        const data = await resp.json()
        return { message: data.message, error: data.error || '' }
      }
      const resp: any = await updateReferenceAssets(
        {
          token: auth.token,
          body: assets.documents,
          id: dataAsset.productId,
        },
      )()
      const data = await resp.json()
      return { message: data.message, error: data.error || '' }
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

export const addAsset = createAsyncThunk<
string,
SelectedFile,
{ rejectValue: SerializedError }
>('device/asset/add', async (file, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as { auth: { token: string } }
    const uploadUrl = await postAsset(auth.token, file)
    return uploadUrl
  } catch (e) {
    return rejectWithValue(e as SerializedError)
  }
})

export const getLanguages = createAsyncThunk<
{ languages: ProductsState['languages'] },
undefined,
{ rejectValue: SerializedError; state: RootState }
>('products/languages/get', async (_, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi
  try {
    const { auth } = getState()
    const res: any = await getMetadata({
      par: 'languages',
      token: auth.token,
    })()
    const { data } = await res.json()
    return data
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const makeProductCopy = createAsyncThunk<
{ data: SingleProduct },
string,
{ rejectValue: SerializedError, state: RootState }
>(
  'product/copy/post',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const res = (
        await postProductCopy({ token: auth.token, id })
      ) as ResponseType<{ data: SingleProduct }>
      const { data } = await res.json()
      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

export const changeParentDevice = createAsyncThunk<
{ message: string, data: string, error: string },
{ body: NewDevice, id: string },
{ rejectValue: SerializedError, state: RootState }
>(
  'product/parent/patch',
  async ({ body, id }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const res: any = await patchParentDevice({
        token: auth.token,
        body,
        id,
      })
      const data = await res.json()
      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

export const getCategories = createAsyncThunk<
Categories[],
{ type: 'faq' | 'tutorial' },
{ rejectValue: SerializedError; state: RootState }
>('products/categories/get', async ({ type }, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi
  try {
    const { auth } = getState()
    const res = (
      await getAllCategories({ token: auth.token, type })()
    ) as ResponseType<Categories[]>
    const { data } = await res.json()
    return data
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const searchDevice = createAsyncThunk<
unknown,
string,
{ rejectValue: SerializedError; state: RootState }
>(
  'device/search',
  async (q, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const res = (
        await searchProductByQuery({ token: auth.token, q })()
      ) as ResponseType<any>
      const data = await res.json()
      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

export const editReferenceCustomers = createAsyncThunk<
{ message: string, error?: string },
{ id: string, customers: { id: string, slug: string }[] },
{ rejectValue: SerializedError; state: RootState }
>(
  'product/reference/customers',
  async ({ id, customers }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const res: any = await patchReferenceCustomers({
        id,
        body: { customers },
        token: auth.token,
      })
      const data = await res.json()
      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

const ProjectSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetSelectedDevice: (state) => {
      state.currentDevice = {
        device: null,
        loading: false,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDevices.fulfilled, (state, { payload }) => {
      state.devices.deviceList = payload.data.products
      state.devices.count = payload.data.count
    })
    builder.addCase(getDevices.rejected, (state, { payload }) => {
      state.error = payload
    })
    builder.addCase(getLanguages.fulfilled, (state, { payload }) => {
      state.languages = payload.languages
    })
    builder.addCase(getLanguages.rejected, (state, { payload }) => {
      state.error = payload
    })
    builder.addCase(getSingleDevice.pending, (state) => {
      state.currentDevice.loading = true
    })
    builder.addCase(getSingleDevice.fulfilled, (state, { payload }) => {
      state.currentDevice.loading = false
      state.currentDevice.device = payload.data
    })
    builder.addCase(getSingleDevice.rejected, (state) => {
      state.currentDevice.loading = false
    })
    builder.addCase(saveDeviceAssets.fulfilled, (state, { payload }) => {
      state.assets.message = payload.message
      state.assets.error = payload.error
    })
    builder.addCase(saveDeviceAssets.rejected, (state, { payload }) => {
      state.assets.message = ''
      state.assets.error = payload || ''
    })
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.currentDevice.loading = false
      state.categories = payload
    })
    builder.addCase(getCategories.rejected, (state, { payload }) => {
      state.error = payload
    })
  },
})

export { ProjectSlice }
export const { resetSelectedDevice } = ProjectSlice.actions
