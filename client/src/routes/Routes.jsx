import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main';
import Home from '../pages/Home';
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
const router = createBrowserRouter([{
    path: '/',
    element: <Main />,
    children:[
        {
            index: 'true',
            // path: '/',
            element: <Home />,
            loader : ()=> fetch(`${import.meta.env.VITE_API_URL}/jobs`)
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/registration',
            element: <Register />
        },
    ]
}]);

export default router;