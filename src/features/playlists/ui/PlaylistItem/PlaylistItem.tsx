import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types'
import { PlaylistCover } from '@/features/playlists/ui/PlaylistItem/PlaylistCover/PlaylistCover'
import { PlaylistDescription } from '@/features/playlists/ui/PlaylistItem/PlaylistDescription/PlaylistDescription'

import s from './PlaylistItem.module.css'

type Props = {
  playlist: PlaylistData
  deletePlaylist: (playlistId: string) => void
  editPlaylist: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylist, deletePlaylist }: Props) => {
  return (
    <div className={s.container}>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription attributes={playlist.attributes} />
      <button onClick={() => deletePlaylist(playlist.id)}>delete</button>
      <button onClick={() => editPlaylist(playlist)}>update</button>
    </div>
  )
}
