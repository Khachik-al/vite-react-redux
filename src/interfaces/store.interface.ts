import { CognitoUser } from '@aws-amplify/auth'
import { ClientMetaData } from '@aws-amplify/auth/lib-esm/types'
import { SerializedError } from '@reduxjs/toolkit'
import type { Categories, Product, SingleProduct } from './data.interface'
import type { Metadata } from './metadata.interface'

interface CognitoUserExt extends CognitoUser {
  signInUserSession?: { idToken: { jwtToken: '' } }
}

export type AuthState = {
  signIn: (email: string, password: string) => any
  newPassword: (
    user: CognitoUser,
    password: string,
    requiredAttributes?: any,
    clientMetadata?: ClientMetaData
  ) => void
  user: {
    tag: 'authorized' | 'notauthorized'
    user?: CognitoUserExt
  }
  token: string
  error: SerializedError | undefined
  loading: boolean
}

export type ProductsState = {
  devices: {
    deviceList: Product['deviceList'][],
    count: number,
  }
  currentDevice: {
    device: null | SingleProduct
    loading: boolean
  }
  languages: Metadata['languages']
  error: SerializedError | undefined
  assets: {
    message: string
    error: string
  }
  categories: Categories[]
}
