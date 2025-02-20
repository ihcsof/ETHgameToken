import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Funding from './pages/funding';
import Heroes from './pages/heroes';
import PageNotFound from './pages/page-not-found';
import Game from './pages/game';

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
        {
            path: '/heroes',
            element: <Heroes />,
            errorElement: <PageNotFound />,
        },
        {
            path: '/game',
            element: <Game />,
            errorElement: <PageNotFound />,
        }
    ],
);