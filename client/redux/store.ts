import { configureStore } from '@reduxjs/toolkit'
import billSlice from './slices/billSlice'
// ...

export const store = configureStore({
  reducer: {
    bill: billSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch