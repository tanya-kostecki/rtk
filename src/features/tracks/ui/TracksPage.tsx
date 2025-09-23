import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll'
import { useFetchTracksInfiniteQuery } from '@/features/tracks/api/tracksApi'
import { LoadingTrigger } from '@/features/tracks/ui/LoadinTrigger/LoadingTrigger'
import { TracksList } from '@/features/tracks/ui/TracksList/TracksList'

export const TracksPage = () => {
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } =
    useFetchTracksInfiniteQuery()
  const { observerRef } = useInfiniteScroll({ hasNextPage, isFetching, fetchNextPage })
  const pages = data?.pages.flatMap((page) => page.data) || []

  return (
    <div>
      <h1>Tracks page</h1>
      <TracksList tracks={pages} />
      {hasNextPage && (
        <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage} />
      )}
      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  )
}
