import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import pt from "./locales/pt.json";


i18n
    .use(initReactI18next).init({
        compatibilityJSON: 'v3',
        lng: 'en', //Definir linguagem inicial
        resources: {
            en: en,
            pt: pt
        },
        interpolation: {
            escapeValue: false, //Evitar a necessidade de escapar essa sequencia em traduções
        },
        react: {
            useSuspense: false,
        }
    });


export default i18n;