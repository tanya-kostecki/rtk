import { useInfiniteScroll } from '@/common/hooks/useInfiniteScroll'
import { useFetchTracksInfiniteQuery } from '@/features/tracks/api/tracksApi'

import s from './TracksPage.module.css'

export const TracksPage = () => {
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } =
    useFetchTracksInfiniteQuery()
  const { observerRef } = useInfiniteScroll({ hasNextPage, isFetching, fetchNextPage })
  const pages = data?.pages.flatMap((page) => page.data)

  return (
    <div>
      <h1>Tracks page</h1>
      <div className={s.list}>
        {pages?.map((track) => {
          const { title, user, attachments } = track.attributes

          return (
            <div key={track.id} className={s.item}>
              <div>
                <p>Title: {title}</p>
                <p>Name: {user.name}</p>
              </div>
              {attachments.length ? <audio controls src={attachments[0].url} /> : 'no file'}
            </div>
          )
        })}
      </div>
      {hasNextPage && (
        <div ref={observerRef}>
          {isFetchingNextPage ? <div>Loading more...</div> : <div style={{ height: '20px' }} />}
        </div>
      )}
      {!hasNextPage && pages && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  )
}
