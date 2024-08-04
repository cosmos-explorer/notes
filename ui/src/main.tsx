import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error';
import AuthRoute from './routes/auth-route.tsx';
import { SignUp } from './components/auth/signup';
import { SignIn } from './components/auth/signin';
import { Toaster } from './components/ui/toaster';
import NotesRoute from './routes/notes-route.tsx';
import List from './components/notes/list';
import { AuthProvider } from './context/auth-context';
import PrivateRoute from './routes/private-route';

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage/>,
    element: <PrivateRoute element={ <NotesRoute/> }/>,
    children: [
      {
        path: "/",
        element: <List/>,
      },
    ],
  },
  {
    path: "/",
    element: <AuthRoute/>,
    children: [
      {
        path: "signup",
        element: <SignUp/>,
      },
      {
        path: "signin",
        element: <SignIn/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={ router }/>
      <Toaster/>
    </AuthProvider>
  </React.StrictMode>,
)
