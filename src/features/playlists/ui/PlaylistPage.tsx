import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  useDeletePlaylistMutation,
  useFetchPlaylistsQuery,
} from '@/features/playlists/api/playlistsApi'
import type { PlaylistData, UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types'
import { CreatePlaylistForm } from '@/features/playlists/ui'
import { EditePlaylistForm } from '@/features/playlists/ui/EditPlaylistForm/EditePlaylistForm'
import { PlaylistItem } from '@/features/playlists/ui/PlaylistItem/PlaylistItem'

import s from './PlaylistPage.module.css'

export const PlaylistsPage = () => {
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
  const { data, isLoading } = useFetchPlaylistsQuery()

  const [deletePlaylist] = useDeletePlaylistMutation()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm('Do you want to delete this playlist?')) {
      deletePlaylist(playlistId)
    }
  }

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <div className={s.items}>
        {data?.data.map((playlist) => {
          const isEditing = playlistId === playlist.id

          return (
            <div className={s.item} key={playlist.id}>
              {isEditing ? (
                <EditePlaylistForm
                  playlistId={playlist.id}
                  setPlaylistId={setPlaylistId}
                  editPlaylist={editPlaylistHandler}
                  register={register}
                  handleSubmit={handleSubmit}
                />
              ) : (
                <PlaylistItem
                  playlist={playlist}
                  editPlaylist={editPlaylistHandler}
                  deletePlaylist={deletePlaylistHandler}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
