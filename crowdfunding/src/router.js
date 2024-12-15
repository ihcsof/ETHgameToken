import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Funding from './pages/funding';
import PageNotFound from './pages/page-not-found';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
      errorElement: <PageNotFound />,
    },
    {
        path: '/funding',
        element: <Funding />,
        errorElement: <PageNotFound />,
      },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_prependBasename: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true
    },
  }
);