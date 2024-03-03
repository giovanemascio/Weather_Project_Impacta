import avatarImg from '../../assets/avatar.png'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
//import icons:
import { FiGlobe, FiStar , FiSettings } from 'react-icons/fi'
import { useTranslation } from 'react-i18next';
import './header.css';
import { LanguageSelector } from '../../components/languageSelector';


export default function Header() {
    const { user } = useContext(AuthContext);

    const { t } = useTranslation();

    return (
        <div className="header-container">
            <div className="sidebar">
                <div>
                    <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário" />
                </div>

                <Link to="/search">
                    <FiGlobe color="#FFF" size={24} />
                    {t('Pesquisar')}
                </Link>

                <Link to="/favorites">
                    <FiStar color="#FFF" size={24} />
                    {t('Favoritos')}
                </Link>

                <Link to="/profile">
                    <FiSettings color="#FFF" size={24} />
                    {t('Perfil')}
                </Link>
            </div>

            <div className="language-selector-container">
                <LanguageSelector />
            </div>
        </div>
    );
}