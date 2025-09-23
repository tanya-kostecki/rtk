import { baseApi } from '@/app/api/baseApi'
import type { FetchTracksResponse } from '@/features/tracks/api/tracksApi.types'

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchTracks: builder.infiniteQuery<FetchTracksResponse, void, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
          return lastPage.meta.nextCursor
        },
      },
      query: ({ pageParam }) => {
        return {
          url: 'playlists/tracks',
          params: {
            cursor: pageParam,
            paginationType: 'cursor',
            pageSize: 5,
          },
        }
      },
    }),
  }),
})
export const { useFetchTracksInfiniteQuery } = tracksApi
