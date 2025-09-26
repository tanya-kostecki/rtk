import { Navigate } from 'react-router'

import { Path } from '@/common/routing/routes'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi'
import { CreatePlaylistForm } from '@/features/playlists/ui'
import { PlaylistList } from '@/features/playlists/ui/PlaylistList/PlaylistList'

import s from './ProfilePage.module.css'

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery()

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery(
    { userId: meResponse?.userId },
    { skip: !meResponse?.userId }
  )

  if (isMeLoading || isPlaylistsLoading) return <div>Skeleton loading....</div>

  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />

  return (
    <div>
      <h1>{meResponse?.login} page</h1>
      <div className={s.container}>
        <CreatePlaylistForm />
        <PlaylistList
          playlists={playlistsResponse?.data || []}
          isLoading={isPlaylistsLoading || isMeLoading}
        />
      </div>
    </div>
  )
}
