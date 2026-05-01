import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { Provider } from 'react-redux'
import {store} from './app/app.store.js'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#1b1c1a', color: '#fbf9f6', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' } }} />
    </Provider>
)
