import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit'
import {
  ChildCategory, FaqBody,
  ParentCategory,
  SingleFaq,
} from '../../interfaces/faq.interface'
import {
  fetchParentCategories,
  fetchChildCategories,
} from '../../services/api'
import {
  postFaq, postCategory, getFaqById, patchFaqById,
} from '../../services/api/faq.service'
import type { RootState } from '../store'
import { ResponseMessage, ResponseType } from '../../interfaces/data.interface'

type State = {
  parentCategories: ParentCategory[]
  childCategories: ChildCategory[]
  currentFaq: SingleFaq | null
  singleFaqLoading: boolean
}

const initialState: State = {
  parentCategories: [],
  childCategories: [],
  currentFaq: null,
  singleFaqLoading: false,
}

export const getParentCategories = createAsyncThunk<
{ data: ParentCategory[] },
undefined,
{ rejectValue: SerializedError; state: RootState }
>('faq/category/get', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    const resp: any = await fetchParentCategories({ token: auth.token })
    const data = await resp.json()

    return data
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const getChildCategories = createAsyncThunk<
{ data: ChildCategory[] },
{ parentId: string },
{ rejectValue: SerializedError; state: RootState }
>('faq/childcategory/get', async ({ parentId }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    const resp: any = await fetchChildCategories({ token: auth.token, parentId })
    const data = await resp.json()

    return data
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const addFaq = createAsyncThunk<
{ message: string, error?: string },
Record<string, any>,
{ rejectValue: SerializedError; state: RootState }
>(
  'faq/post',
  async (body, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const resp = await postFaq(
        { token: auth.token, body },
      ) as ResponseMessage
      const data = await resp.json()

      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

export const createCategory = createAsyncThunk<
{ data: { message: string } },
Record<string, any>,
{ rejectValue: SerializedError; state: RootState }
>(
  'faq/parentcategory/post',
  async (body, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const resp: any = await postCategory({ token: auth.token, body })
      const data = await resp.json()

      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

export const getSingleFaq = createAsyncThunk<
{ data: SingleFaq },
string,
{ rejectValue: SerializedError; state: RootState }
>(
  'faq/getById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const resp = (
        await getFaqById({ token: auth.token, id })
      ) as ResponseType<SingleFaq>
      const data = await resp.json()

      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

export const editFaq = createAsyncThunk<
{ message: string, error?: string },
{ id: string, body: FaqBody },
{ rejectValue: SerializedError; state: RootState }
>(
  'faq/editById',
  async ({ id, body }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const resp = (
        await patchFaqById({ token: auth.token, id, body })
      ) as ResponseMessage
      const data = await resp.json()

      return data
    } catch (e) {
      return rejectWithValue(e as SerializedError)
    }
  },
)

const FaqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    resetCurrentFaq(state) {
      state.currentFaq = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getParentCategories.fulfilled, (state, action) => {
      state.parentCategories = action.payload.data
    })
    builder.addCase(getChildCategories.fulfilled, (state, action) => {
      state.childCategories = action.payload.data
    })
    builder.addCase(getSingleFaq.pending, (state) => {
      state.singleFaqLoading = true
    })
    builder.addCase(getSingleFaq.fulfilled, (state, action) => {
      state.currentFaq = action.payload.data
      state.singleFaqLoading = false
    })
    builder.addCase(getSingleFaq.rejected, (state) => {
      state.singleFaqLoading = false
    })
  },
})

export const { resetCurrentFaq } = FaqSlice.actions
export { FaqSlice }
