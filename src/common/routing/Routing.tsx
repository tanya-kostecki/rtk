import { Route, Routes } from 'react-router'

import { MainPage } from '@/app'
import { PageNotFound } from '@/common'
import { ProfilePage, TracksPage, PlaylistsPage } from '@/features'

import { Path } from './routes'

export const Routing = () => (
  <Routes>
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={Path.Profile} element={<ProfilePage />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)
