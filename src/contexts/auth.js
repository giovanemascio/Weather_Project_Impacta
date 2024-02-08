import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify'


export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    //Para colocar uma "bolinha girando" de esperar:
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const { t, i18n } = useTranslation();

    const navigate = useNavigate();

    //Para manter o usuário logado:
    useEffect(() => {
        async function loadUser() {
            const storageUser = localStorage.getItem('@ticketsPRO')

            if (storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(false);
            }
            setLoading(false);
        }
        loadUser();
    }, [])


    async function signIn(email, password) {
        setLoadingAuth(true);
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef)

                let data = {
                    uid: uid,
                    nome: docSnap.data().nome,
                    email: value.user.email,
                    avatarUrl: docSnap.data().avatarUrl
                }
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success(t("Bem-vindo(a) de volta!"));
                navigate("/search")
            })
            .catch((error) => {
                console.log(error);
                setLoadingAuth(false);
                toast.error(t("Ops! Algo deu errado."));
            })
    }
    //Cadastrar um novo user:
    async function signUp(email, password, name) {
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid

                await setDoc(doc(db, "users", uid), {
                    nome: name,
                    avatarUrl: null,
                })
                    .then(() => {
                        //alert(t("Cadastrado com sucesso!"))

                        let data = {
                            uid: uid,
                            nome: name,
                            email: value.user.email,
                            avatarUrl: null
                        };

                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        toast.success(t("Seja bem-vindo!"))
                        navigate("/search")
                    })
            })
            .catch((error) => {
                console.log(error);
                setLoadingAuth(false);
            })
    }

    // Função para salvar no storage do navegador as infos do user:
    function storageUser(data) {
        localStorage.setItem('@ticketsPRO', JSON.stringify(data))
    }

    async function logout() {
        await signOut(auth);
        localStorage.removeItem('@ticketsPRO');
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;