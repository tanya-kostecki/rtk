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
      onQueryStarted: async ({ playlistId, body }, { queryFulfilled, dispatch }) => {
        const patchCollection = dispatch(
          playlistsApi.util.updateQueryData(
            'fetchPlaylists',
            {
              pageNumber: 1,
              pageSize: 2,
              search: '',
            },
            (state) => {
              const index = state.data.findIndex((playlist) => playlist.id === playlistId)
              if (index !== -1) {
                state.data[index].attributes = { ...state.data[index].attributes, ...body }
              }
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchCollection.undo()
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
