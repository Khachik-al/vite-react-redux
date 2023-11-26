import { Auth, CognitoUser } from '@aws-amplify/auth'
import { ClientMetaData } from '@aws-amplify/auth/lib-esm/types'
import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit'
import type { AuthState } from '../../interfaces/store.interface'
import type { RootState } from '../store'

type User = {
  tag: 'authorized' | 'notauthorized'
  user?: CognitoUser
}

type UserCfg = {
  signIn: (email: string, password: string) => Promise<unknown>
  newPassword: (
    user: any,
    password: string,
    requiredAttributes?: any,
    clientMetadata?: ClientMetaData
  ) => Promise<unknown>
  token: () => string
}

const initialState: AuthState = {
  signIn: () => {},
  newPassword: () => {},
  user: { tag: 'notauthorized' },
  token: '',
  error: {},
  loading: true,
}

export const getUser = createAsyncThunk<
User,
undefined,
{ rejectValue: { tag: 'notauthorized' } }
>('auth/user/get', async () => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    return {
      tag: 'authorized',
      user,
    }
  } catch (error) {
    return { tag: 'notauthorized' }
  }
})

export const getUserCfg = createAsyncThunk<
UserCfg,
undefined,
{ rejectValue: SerializedError; state: RootState }
>('auth/cfg/get', async (_, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi
  try {
    const { auth } = getState()
    const data = {
      signIn: Auth.signIn.bind(Auth),
      newPassword: Auth.completeNewPassword.bind(Auth),
      token: () => {
        const s = auth.user.tag === 'notauthorized'
          ? ''
          : auth.user.user?.signInUserSession
        return s ? s.idToken.jwtToken : ''
      },
    }
    return data
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const submitUser = createAsyncThunk<
CognitoUser,
{ email: string; password: string },
{ rejectValue: SerializedError; state: RootState }
>('auth/user/login', async ({ email, password }, thunkApi) => {
  const { getState, rejectWithValue } = thunkApi
  try {
    const { auth } = getState()
    const data = await auth.signIn(email, password)
    if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
      auth.newPassword(data, password)
    }
    return data
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const signOutUser = createAsyncThunk('auth/user/signout', async (_, thunkApi) => {
  const { rejectWithValue } = thunkApi
  try {
    const data = await Auth.signOut()
    return data
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

const UsersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.user = payload
      state.loading = false
    })
    builder.addCase(getUser.rejected, (state, { payload }) => {
      state.user = payload as { tag: 'notauthorized' }
      state.loading = false
    })
    builder.addCase(getUserCfg.fulfilled, (state, { payload }) => {
      state.signIn = payload.signIn
      state.newPassword = payload.newPassword
      state.token = payload.token()
    })
    builder.addCase(getUserCfg.rejected, (state, { payload }) => {
      state.error = payload
    })
    builder.addCase(submitUser.fulfilled, (state, { payload }) => {
      state.user.user = payload
      state.user.tag = 'authorized'
    })
    builder.addCase(submitUser.rejected, (state, { payload }) => {
      state.user.tag = 'notauthorized'
      state.error = payload
    })
    builder.addCase(signOutUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(signOutUser.fulfilled, (state) => {
      state.loading = false
      state.user = { tag: 'notauthorized' }
      state.token = ''
    })
    builder.addCase(signOutUser.rejected, (state) => {
      state.loading = false
    })
  },
})

export { UsersSlice }
