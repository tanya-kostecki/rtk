import type { ChangeEvent } from 'react'

import defaultCover from '@/assets/images/default-playlist-cover.png'
import type { Images } from '@/common/types'
import { errorToast } from '@/common/utils'
import {
  useDeletePlaylistCoverMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi'

import s from './PlaylistCover.module.css'

type Props = {
  images: Images
  playlistId: string
}
export const PlaylistCover = ({ playlistId, images }: Props) => {
  const originalCover = images.main?.find((img) => img.type === 'original')
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const uploadPlaylistCoverHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    const file = e.target.files?.length && e.target.files[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      errorToast('Only JPEG, PNG or GIF images are allowed')
      return
    }

    if (file.size > maxSize) {
      errorToast(`The file is too large (max. ${Math.round(maxSize / 1024)} KB)`)
      return
    }

    uploadPlaylistCover({ playlistId, file })
  }

  const deletePlaylistCoverHandler = () => deletePlaylistCover({ playlistId })
  const src = originalCover ? originalCover.url : defaultCover
  return (
    <>
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
    </>
  )
}
