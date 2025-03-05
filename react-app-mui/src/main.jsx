import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import App from './App.jsx'
import Container from '@mui/material/Container';

createRoot(document.getElementById('root')).render(  
  <StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </StrictMode>,
)
