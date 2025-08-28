/*https://musicfun.it-incubator.app/api/1.0*/
// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
  FetchPlaylistsArgs,
  PlaylistsResponse,
} from '@/features/playlists/api/playlistsApi.types'

// Define a service using a base URL and expected endpoints
export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      'API-KEY': import.meta.env.VITE_API_KEY,
    },
  }),
  endpoints: (builder) => ({
    fetchPlaylists: builder.query<PlaylistsResponse, void>({
      query: () => 'playlists',
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFetchPlaylistsQuery } = playlistsApi
