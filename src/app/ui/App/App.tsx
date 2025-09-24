import { ToastContainer } from 'react-toastify'

import { Header, LinearProgress, Routing } from '@/common'
import { useGlobalLoading } from '@/common/hooks'

import s from './App.module.css'

export const App = () => {
  const isGlobalLoading = useGlobalLoading()
  return (
    <>
      <Header />
      {isGlobalLoading && <LinearProgress />}
      <div className={s.layout}>
        <Routing />
      </div>
      <ToastContainer />
    </>
  )
}
