import { baseApi } from '@/app/api/baseApi'
import type { Images } from '@/common/types'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchPlaylists: builder.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({ url: 'playlists', params }),
      providesTags: ['Playlists'],
    }),
    createPlaylists: builder.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({ method: 'post', url: `playlists`, body }),
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
    uploadPlaylistCover: builder.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return { method: 'post', url: `playlists/${playlistId}/images/main`, body: formData }
      },
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
