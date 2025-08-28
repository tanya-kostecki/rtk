import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'

import { store } from '@/app/model/store'
import { App } from '@/app/ui/App/App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)
