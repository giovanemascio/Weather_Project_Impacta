// Chamar rotas das páginas:

import { Routes, Route } from 'react-router-dom'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp';
import Search from '../pages/Search'
import Profile from '../pages/Profile'
import Forgot from '../pages/Forgot'
// Importar Private para proteger rota admin:
import Private from './Private';




// Rotas:
function RoutesApp() {
    return (
        <Routes>
            <Route path='/' element={<SignIn />} />
            <Route path='/register' element={<SignUp />} />
            <Route path='/reset' element={<Forgot />} />

            <Route path='/search' element={<Private> <Search /> </Private>} />
            <Route path='/profile' element={<Private> <Profile /> </Private>} />

        </Routes>
    )
}

export default RoutesApp;
