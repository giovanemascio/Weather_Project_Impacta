import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSunRain } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react'
import './SignIn.css'
//Para acessar a página de Register atavés de routes:
import { Link } from 'react-router-dom'
//Importar i18n
//import '../../i18n';
import { useTranslation } from 'react-i18next';
//Importar component da seleção de linguagem:
import { LanguageSelector } from '../../components/languageSelector';
//Importar conexão e método login firebase:
import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword } from 'firebase/auth'
//Importar hook para navegar o usuário, depois instanciar ele:
import { useNavigate } from 'react-router-dom'


export default function SignIn() {
    // Criação dos estados para armazenar os valores:
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { t, i18n } = useTranslation();

    const navigate = useNavigate();

    //Função do formulário que recebe onSubmit={handleLogin}:
    async function handleLogin(e) {
        // pra não atualizar a página:
        e.preventDefault();

        // Verifica se os campos estão preenchidos para prosseguir:
        if (email !== '' && password !== '') {

            await signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    // navegar para admin:
                    navigate('/admin', { replace: true })
                })
                .catch(() => {
                    console.log("Erro ao fazer o login!")
                })

        } else {
            alert("Preencha todos os campos!")
        }

    }

    return (
        <div className="SignIn-container">
            <LanguageSelector />
            <h1>ClimaExplorer <FontAwesomeIcon icon={faCloudSunRain} /></h1>

            <span>{t("Pesquise meteorologia pelo mundo.")}</span>

            <form className="form" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder={t("Digite seu email")}
                    // Receber o email e passar pra state:
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t("Senha")}
                    // Receber o password e passar pra state:
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">{t('Acessar')}</button>
            </form>

            <Link className="button-link" to="/register">
                {t("Não possui uma conta? Cadastre-se")}
            </Link>
        </div>
    )
}
