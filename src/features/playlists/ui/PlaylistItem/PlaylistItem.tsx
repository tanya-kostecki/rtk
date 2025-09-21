import type { ChangeEvent } from 'react'

import defaultCover from '@/assets/images/default-playlist-cover.png'
import {
  useDeletePlaylistCoverMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi'
import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types'

import s from './PlaylistItem.module.css'

type Props = {
  playlist: PlaylistData
  deletePlaylist: (playlistId: string) => void
  editPlaylist: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylist, deletePlaylist }: Props) => {
  const originalCover = playlist.attributes.images.main?.find((img) => img.type === 'original')
  const src = originalCover ? originalCover.url : defaultCover

  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const uploadPlaylistCoverHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    const file = e.target.files?.length && e.target.files[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG or GIF images are allowed')
      return
    }

    if (file.size > maxSize) {
      alert(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      return
    }

    uploadPlaylistCover({ playlistId: playlist.id, file })
  }

  const deletePlaylistCoverHandler = () => deletePlaylistCover({ playlistId: playlist.id })

  return (
    <div className={s.container}>
      <div className={s.coverContainer}>
        <img src={src} alt="cover" width="240px" className={s.cover} />
        {originalCover && (
          <button className={s.coverButton} onClick={deletePlaylistCoverHandler}>
            x
          </button>
        )}
      </div>
      <input
        type={'file'}
        accept="image/jpeg,image/png,image/gif"
        className={s.file}
        onChange={uploadPlaylistCoverHandler}
      />
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => deletePlaylist(playlist.id)}>delete</button>
      <button onClick={() => editPlaylist(playlist)}>update</button>
    </div>
  )
}
