// FORGOT PASSWORD
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useState, useContext } from 'react'
//Para acessar a página de SignIn atavés de routes:
import { Link } from 'react-router-dom'
//Importar conexão e método login firebase:
//import { auth } from '../../services/firebaseConnection'
import { AuthContext } from '../../contexts/auth';
//Importar hook para navegar o usuário, depois instanciar ele:
//import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
//import '../../components/languageSelector';
import { LanguageSelector } from '../../components/languageSelector';


// Component SignUp:
export default function Forgot() {
    // Criação dos estados para armazenar os valores:

    const [email, setEmail] = useState('')

    const { forgot, loadingAuth } = useContext(AuthContext);

    const { t } = useTranslation();

    //const navigate = useNavigate();

    //Função do formulário que recebe onSubmit={handleForgot}:
    async function handleForgot(e) {
        e.preventDefault();

        // Verifica se os campos estão preenchidos para prosseguir:
        if (email !== '') {
            console.log(email)
            await forgot(email)
        }
    }

    return (
        <div className="signIn-container">
            <LanguageSelector />
            <h1>{t("Redefinir senha")} <FontAwesomeIcon icon={faCircleExclamation} /></h1>

            <span>{t("Forneça o email que você usou quando se inscreveu:")}</span>

            <form className="form" onSubmit={(e) => handleForgot(e)}>
                <input
                    type="text"
                    placeholder={t("Digite seu email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />


                <button type="submit">
                    {loadingAuth ? t('Carregando...') : t('Redefinir senha')}
                </button>
            </form>

            <Link className="button-link" to="/">
                {t("Já possui uma conta? Faça login!")}
            </Link>
        </div>
    )
}

