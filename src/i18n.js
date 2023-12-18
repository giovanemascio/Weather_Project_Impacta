import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const STORAGE_KEY = "userLanguage";
const storedLanguage = localStorage.getItem(STORAGE_KEY);


i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        lng: storedLanguage || 'en', // Use o idioma armazenado localmente ou padrão para 'en'
        resources: {
            en: en,
            pt: pt
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        }
    });

// Atualize o idioma armazenado localmente sempre que o idioma for alterado
i18n.on('languageChanged', (lng) => {
    localStorage.setItem(STORAGE_KEY, lng);
});


export default i18n;