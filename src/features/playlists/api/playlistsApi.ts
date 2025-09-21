import { baseApi } from '@/app/api/baseApi'
import type { Images } from '@/common/types'
import type {
  CreatePlaylistArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types'

// Define a service using a base URL and expected endpoints
export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchPlaylists: builder.query<PlaylistsResponse, { userId: number }>({
      query: ({ userId }) => `playlists?userId=${userId}`,
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
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistsMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
} = playlistsApi
