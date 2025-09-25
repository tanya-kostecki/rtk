import type { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

import { useUpdatePlaylistMutation } from '@/features/playlists/api/playlistsApi'
import type { UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types'

type Props = {
  playlistId: string | null
  setPlaylistId: (playlistId: null) => void
  editPlaylist: (playlist: null) => void
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
}

export const EditePlaylistForm = ({
  playlistId,
  setPlaylistId,
  editPlaylist,
  register,
  handleSubmit,
}: Props) => {
  const [updatePlaylist] = useUpdatePlaylistMutation()

  const onSubmit = (body: UpdatePlaylistArgs) => {
    if (!playlistId) return
    updatePlaylist({ playlistId, body })
    setPlaylistId(null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button type={'submit'}>save</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        cancel
      </button>
    </form>
  )
}
