import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '@/app/api/baseQueryWithReauth'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlists', 'Auth'],
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 10,
  /*refetchOnFocus: true,*/
  /*refetchOnReconnect: true,*/
  endpoints: () => ({}),
})
