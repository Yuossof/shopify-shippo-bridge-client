import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { AppProvider } from '@shopify/polaris'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider i18n={{}}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
