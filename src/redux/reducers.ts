import { combineReducers } from '@reduxjs/toolkit'
import { UsersSlice } from './slices/auth'
import { ProjectSlice } from './slices/products'
import { FaqSlice } from './slices/faq'
import { MetadataSlice } from './slices/metadata'

export const rootReducers = combineReducers({
  auth: UsersSlice.reducer,
  products: ProjectSlice.reducer,
  faq: FaqSlice.reducer,
  metadata: MetadataSlice.reducer,
})
