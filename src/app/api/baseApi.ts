import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '@/app/api/baseQueryWithReauth'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlists', 'Auth'],
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 10,
  skipSchemaValidation: process.env.NODE_ENV === 'production',
  /*refetchOnFocus: true,*/
  /*refetchOnReconnect: true,*/
  endpoints: () => ({}),
})
