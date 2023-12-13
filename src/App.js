import { BrowserRouter } from "react-router-dom"
import RoutesApp from "./routes"
import { I18nextProvider } from 'react-i18next';
import i18n from "./i18n"

export default function App() {
    return (
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <RoutesApp />
            </I18nextProvider>
        </BrowserRouter>
    )
}
