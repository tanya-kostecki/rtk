import { baseApi } from '@/app/api/baseApi'
import { withZodCatch } from '@/common/utils'
import type { FetchTracksResponse } from '@/features/tracks/api/tracksApi.types'
import { fetchTracksResponseSchema } from '@/features/tracks/model/tracks.schemas'

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
      ...withZodCatch(fetchTracksResponseSchema),
    }),
  }),
})
export const { useFetchTracksInfiniteQuery } = tracksApi
