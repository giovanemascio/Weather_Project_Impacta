import { useTranslation } from 'react-i18next'
import br from '../../assets/br.png'
import us from '../../assets/us.png'
import './languageSelector.css'
import React, { useState } from 'react';


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
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        setSelectedLanguage(language);
    };

    return (
        <div className='language-selector'>
            {Options.map(option => (
                <button
                    key={option.value}
                    onClick={() => handleLanguageChange(option.value)}
                    className={selectedLanguage === option.value ? 'selected' : ''}>
                    <img src={option.flag} alt={option.name} />
                </button>
            ))}
        </div>
    );
};


