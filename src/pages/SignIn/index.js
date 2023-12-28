import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSunRain } from '@fortawesome/free-solid-svg-icons';
import { useState, useContext } from 'react'
import './signin.css'
//Para acessar a página de Register atavés de routes:
import { Link } from 'react-router-dom'
//Importar i18n
//import '../../i18n';
import { useTranslation } from 'react-i18next';
//Importar component da seleção de linguagem:
import { LanguageSelector } from '../../components/languageSelector';
//Importar hook para navegar o usuário, depois instanciar ele:
//import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth';


export default function SignIn() {
    // Criação dos estados para armazenar os valores:
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn, loadingAuth } = useContext(AuthContext)

    const { t } = useTranslation();

    //const navigate = useNavigate();

    //Função do formulário que recebe onSubmit={handleLogin}:
    async function handlesignIn(e) {
        // pra não atualizar a página:
        e.preventDefault();

        // Verifica se os campos estão preenchidos para prosseguir:
        if (email !== '' && password !== '') {
            await signIn(email, password);
        }
    }

    return (
        <div className="signIn-container">
            <LanguageSelector />
            <h1>ClimaExplorer <FontAwesomeIcon icon={faCloudSunRain} /></h1>

            <span>{t("Pesquise meteorologia pelo mundo.")}</span>

            <form className="form" onSubmit={handlesignIn}>
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

                <button type="submit">
                    {loadingAuth ? t('Carregando...') : t('Acessar')}
                </button>
            </form>

            <Link className="button-link" to="/register">
                {t("Não possui uma conta? Cadastre-se")}
            </Link>
        </div>
    )
}
