import { type ChangeEvent, useState } from 'react'

import { Pagination } from '@/common'
import { useDebounceValue } from '@/common/hooks'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi'
import { PlaylistList } from '@/features/playlists/ui/PlaylistList/PlaylistList'

import s from './PlaylistPage.module.css'

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)

  const debouncedSearch = useDebounceValue(search)
  const { data, isLoading } = useFetchPlaylistsQuery(
    {
      search: debouncedSearch,
      pageNumber: currentPage,
      pageSize,
    }
    /*{
      refetchOnFocus: false,
      refetchOnReconnect: true,
      pollingInterval: 10000,
      skipPollingIfUnfocused: true,
    }*/
  )

  const changePageSizeHandler = (size: number) => {
    setCurrentPage(1)
    setPageSize(size)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  if (isLoading) return <div> Skeleton loading...</div>

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <input
        type="search"
        placeholder={'Search playlist by title'}
        onChange={searchPlaylistHandler}
      />
      <PlaylistList playlists={data?.data || []} isLoading={isLoading} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  )
}
