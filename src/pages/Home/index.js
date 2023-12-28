import './home.css'
import { AuthContext } from '../../contexts/auth'
import { useContext } from 'react'
import Header from '../../components/Header'

export default function Home() {
    const { logout } = useContext(AuthContext);

    async function handleLogout() {
        await logout();
    }

    return (
        <div>
            <Header />

            <h1>Pag Home</h1>
            <button onClick={handleLogout}>Sair da conta</button>
        </div>
    )
}