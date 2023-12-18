import { useContext } from 'react'
//import { auth } from '../services/firebaseConnection'
//import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

// Para proteger a routa admin - apenas usuários logados acessarem:
export default function Private({ children }) {
    const { signed, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div></div>
        )
    }

    if (!signed) {
        return <Navigate to="/" />
    }

    return children
}
