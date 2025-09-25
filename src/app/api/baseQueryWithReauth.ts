import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'

import { baseApi } from '@/app/api/baseApi'
import { baseQuery } from '@/app/api/baseQuery'
import { AUTH_KEYS } from '@/common/constants'
import { handleErrors, isTokens } from '@/common/utils'

// create a new mutex
const mutex = new Mutex()

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
      try {
        const refreshResult = await baseQuery(
          { url: '/auth/refresh', method: 'post', body: { refreshToken } },
          api,
          extraOptions
        )
        if (refreshResult.data && isTokens(refreshResult.data)) {
          localStorage.setItem(AUTH_KEYS.refreshToken, refreshResult.data.refreshToken)
          localStorage.setItem(AUTH_KEYS.accessToken, refreshResult.data.accessToken)
          // retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          api.dispatch(baseApi.endpoints.logout.initiate())
        }
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  if (result.error && result.error.status !== 401) {
    handleErrors(result.error)
  }

  return result
}
