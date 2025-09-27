import { baseApi } from '@/app/api/baseApi'
import { SOCKET_EVENTS } from '@/common/constants'
import { imagesSchema } from '@/common/schemas'
import { subscribeToEvent } from '@/common/socket'
import { withZodCatch } from '@/common/utils'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types'
import {
  playlistCreateResponseSchema,
  playlistsResponseSchema,
} from '@/features/playlists/model/playlists.schemas'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchPlaylists: builder.query({
      query: (params: FetchPlaylistsArgs) => ({ url: 'playlists', params }),
      keepUnusedDataFor: 0,
      onCacheEntryAdded: async (_arg, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) => {
        await cacheDataLoaded

        const unsubscribes = [
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
            const newPlaylist = msg.payload.data

            updateCachedData((state) => {
              state.data.pop() //delete last element - only the indicated amount of playlists must be visible
              state.data.unshift(newPlaylist)
              state.meta.totalCount = state.meta.totalCount + 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)

              // 2 вариант invalidates cache and triggers a new server request
              // dispatch(playlistsApi.util.invalidateTags(['Playlist']))
            })
          }),
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg) => {
            const newPlaylist = msg.payload.data

            updateCachedData((state) => {
              const index = state.data.findIndex((playlist) => playlist.id === newPlaylist.id)
              if (index !== -1) {
                state.data[index] = { ...state.data[index], ...newPlaylist }
              }
            })
          }),
        ]

        await cacheEntryRemoved
        unsubscribes.forEach((unsubscribe) => unsubscribe())
      },
      ...withZodCatch(playlistsResponseSchema),
      providesTags: ['Playlists'],
    }),
    createPlaylists: builder.mutation({
      query: (body: CreatePlaylistArgs) => ({ method: 'post', url: `playlists`, body }),
      ...withZodCatch(playlistCreateResponseSchema),
      invalidatesTags: ['Playlists'],
    }),
    deletePlaylist: builder.mutation<void, string>({
      query: (playlistId) => ({ method: 'delete', url: `playlists/${playlistId}` }),
      invalidatesTags: ['Playlists'],
    }),
    updatePlaylist: builder.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({ method: 'put', url: `playlists/${playlistId}`, body }),
      onQueryStarted: async ({ playlistId, body }, { queryFulfilled, dispatch, getState }) => {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchCollections: any[] = []

        args.forEach((arg) => {
          dispatch(
            playlistsApi.util.updateQueryData(
              'fetchPlaylists',
              {
                pageNumber: arg.pageNumber,
                pageSize: arg.pageSize,
                search: arg.search,
              },
              (state) => {
                const index = state.data.findIndex((playlist) => playlist.id === playlistId)
                if (index !== -1) {
                  state.data[index].attributes = { ...state.data[index].attributes, ...body }
                }
              }
            )
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchCollections.forEach((patchCollection) => patchCollection.undo())
        }
      },
      invalidatesTags: ['Playlists'],
    }),
    uploadPlaylistCover: builder.mutation({
      query: ({ playlistId, file }: { playlistId: string; file: File }) => {
        const formData = new FormData()
        formData.append('file', file)
        return { method: 'post', url: `playlists/${playlistId}/images/main`, body: formData }
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ['Playlists'],
    }),
    deletePlaylistCover: builder.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({ method: 'delete', url: `playlists/${playlistId}/images/main` }),
      invalidatesTags: ['Playlists'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistsMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
