import type { PlaylistAttributes } from '@/features/playlists/api/playlistsApi.types'

type Props = {
  attributes: PlaylistAttributes
}
export const PlaylistDescription = ({ attributes }: Props) => {
  const { title, description, user } = attributes
  return (
    <>
      <div>title: {title}</div>
      <div>description: {description}</div>
      <div>userName: {user.name}</div>
    </>
  )
}
