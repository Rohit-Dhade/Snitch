import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { ToastProvider } from '../components/Toaster'
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';


const App = () => {

  const { handleGetme } = useAuth();

  useEffect(() => {
    handleGetme();
  }, [])


  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App