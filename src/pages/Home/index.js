import './home.css'
import { AuthContext } from '../../contexts/auth'
import { useContext } from 'react'

export default function Home() {
    const { logout } = useContext(AuthContext);

    async function handleLogout() {
        await logout();
    }

    return (
        <div>
            <h1>Pag Home</h1>
            <button onClick={handleLogout}>Sair da conta</button>
        </div>
    )
}