import { BrowserRouter } from "react-router-dom"
import RoutesApp from "./routes"
import { I18nextProvider } from 'react-i18next';
import i18n from "./i18n"
// Importar auth como contexto para usar de forma global:
import AuthProvider from './contexts/auth';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastContainer autoClose={2000} />
                <I18nextProvider i18n={i18n}>
                    <RoutesApp />
                </I18nextProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;