import { useTranslation } from 'react-i18next'
import br from '../../assets/br.png'
import us from '../../assets/us.png'
import './languageSelector.css'


const Options = [
    {
        name: "Português",
        value: "pt",
        flag: br
    },
    {
        name: "English",
        value: "en",
        flag: us
    },
]

export const LanguageSelector = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className='language-selector'>

            {Options.map(Options => (
                <button
                    key={Options.value}
                    onClick={() => {
                        i18n.changeLanguage(Options.value)
                    }}>
                    <img src={Options.flag} alt={Options.name} />

                </button>
            ))}
        </div>
    )
}

