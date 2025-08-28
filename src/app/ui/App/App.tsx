import { Header, Routing } from '@/common'

import s from './App.module.css'

export const App = () => {
  return (
    <>
      <Header />
      <div className={s.layout}>
        <Routing />
      </div>
    </>
  )
}
