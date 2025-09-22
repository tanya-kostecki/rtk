import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useDeletePlaylistMutation } from '@/features/playlists/api/playlistsApi'
import type { PlaylistData, UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types'
import { EditePlaylistForm } from '@/features/playlists/ui/EditPlaylistForm/EditePlaylistForm'
import { PlaylistItem } from '@/features/playlists/ui/PlaylistItem/PlaylistItem'

import s from './PlaylistList.module.css'

type Props = {
  playlists: PlaylistData[]
  isLoading: boolean
}
export const PlaylistList = ({ playlists, isLoading }: Props) => {
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const [deletePlaylist] = useDeletePlaylistMutation()

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

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
  return (
    <div className={s.items}>
      {!playlists?.length && !isLoading && <h2>Playlists not found</h2>}
      {playlists?.map((playlist) => {
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
  )
}
