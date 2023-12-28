import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { useState, useContext } from 'react'
//Para acessar a página de SignUp atavés de routes:
import { Link } from 'react-router-dom'
//Importar conexão e método login firebase:
import { auth } from '../../services/firebaseConnection'
import { AuthContext } from '../../contexts/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth'
//Importar hook para navegar o usuário, depois instanciar ele:
import { useNavigate } from 'react-router-dom'
//Importar i18n
//import '../../i18n';
import { useTranslation } from 'react-i18next';
//import '../../components/languageSelector';
import { LanguageSelector } from '../../components/languageSelector';


// Component SignUp:
export default function SignUp() {
    // Criação dos estados para armazenar os valores:
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signUp, loadingAuth } = useContext(AuthContext);

    const { t } = useTranslation();

    const navigate = useNavigate();

    //Função do formulário que recebe onSubmit={handleLogin}:
    async function handleSignUp(e) {
        e.preventDefault();

        // Verifica se os campos estão preenchidos para prosseguir:
        if (email !== '' && password !== '') {
            await signUp(email, password, name)
        }
    }

    return (
        <div className="signIn-container">
            <LanguageSelector />
            <h1>{t("Cadastre-se")} <FontAwesomeIcon icon={faAt} /></h1>

            <span>{t("Vamos criar sua conta!")}</span>

            <form className="form" onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder={t("Seu nome")}
                    // Receber o email e passar pra state:
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                    {loadingAuth ? t('Carregando...') : t('Registrar')}
                </button>
            </form>

            <Link className="button-link" to="/">
                {t("Já possui uma conta? Faça login!")}
            </Link>
        </div>
    )
}

//{loadingAuth ? t('Carregando...') : t('Registrar')}