// Chamar rotas das páginas:

import { Routes, Route } from 'react-router-dom'

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home'

// Importar Private para proteger rota admin:
import Private from './Private';


// Rotas:
function RoutesApp() {
    return (
        <Routes>
            <Route path='/' element={<SignIn />} />
            <Route path='/register' element={<SignUp />} />

            <Route path='/home' element={<Private> <Home /> </Private>} />
        </Routes>
    )
}

export default RoutesApp;
