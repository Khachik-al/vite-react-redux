import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit'
import {
  postCarrier,
  postManufacturer,
  putBinary, fetchMetadata,
  getCustomers, getImageUrl,
  patchDeviceCustomers,
} from '../../services/api'
import type { Metadata, SelectedFile } from '../../interfaces/metadata.interface'

const initialState: { metadata: Metadata } = {
  metadata: {
    roles: [],
    manufacturers: [],
    languages: [],
    carriers: [],
    productTypes: [],
  },
}

export const getMetadata = createAsyncThunk(
  'metadata/get',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } }
      const res = fetchMetadata({ token: auth.token })
      const data: any = await res()
      return data.json()
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const postNewCarrier = createAsyncThunk(
  'metadata/post/carrier',
  async (name: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } }
      const res = postCarrier({ token: auth.token, name })
      const data: any = await res()
      const result = await data.json()
      return result.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const addNewManufacturer = createAsyncThunk(
  '/metadata/post/manufacturer',
  async (
    { selectedFile, newManufacturer }: { selectedFile: SelectedFile, newManufacturer: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const { auth } = getState() as { auth: { token: string } }
      const imageUrl: any = await getImageUrl({
        token: auth.token,
        p: {
          directory: `product-manufacturers/${selectedFile.fileName}`,
          objectName: `${selectedFile.fileName}`,
        },
      })()

      const test = await imageUrl.json()

      const binaryResp = await putBinary(test.data.uploadUrl, selectedFile.myFile)

      const res: any = await postManufacturer(
        {
          token: auth.token,
          p: {
            name: newManufacturer,
            imageUrl: binaryResp.url,
          },
        },
      )()
      const result = await res.json()

      return result.data
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const getCustomersList = createAsyncThunk<
{
  id: string
  name: string
  shortname: string
}[],
string,
{ rejectValue: SerializedError }
>(
  'customers/get',
  async (p, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } }
      const data: any = await getCustomers({ token: auth.token, p })()
      const result = await data.json()
      return result.data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

export const editDeviceCustomers = createAsyncThunk<
{ error?: string, message: string },
{ id: string, customerIds: string[] },
{ rejectValue: SerializedError }
>(
  'products/customers/patch',
  async ({ id, customerIds }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string } }
      const result: any = await patchDeviceCustomers({
        body: { customerIds },
        token: auth.token,
        id,
      })()
      const data = await result.json()
      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

const MetadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMetadata.fulfilled, (state, action) => {
      state.metadata = action.payload.data
    })
    builder.addCase(postNewCarrier.fulfilled, (state, action) => {
      state.metadata.carriers?.push(action.payload)
    })
    builder.addCase(addNewManufacturer.fulfilled, (state, action) => {
      state.metadata.manufacturers?.push(action.payload)
    })
  },
})

export { MetadataSlice }
