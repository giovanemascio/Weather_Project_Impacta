import './favorites.css'
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiStar, FiTrash2 } from 'react-icons/fi'
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useContext } from 'react';
import { DocRef, getDoc, doc, updateDoc, startAfter, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth'


export default function Favorites() {
    const { t } = useTranslation();

    const STORAGE_KEY = "userLanguage";
    const storedLanguage = localStorage.getItem(STORAGE_KEY);


    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true); // Inicialmente, configuramos como true para indicar que está carregando

    useEffect(() => {
        async function loadFavorites() {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const fav1 = userData.fav1;
                    const fav2 = userData.fav2;
                    const fav3 = userData.fav3;
                    // Filtra os favoritos que não são null
                    const filteredFavorites = [fav1, fav2, fav3].filter(favorite => favorite !== null);

                    setFavorites(filteredFavorites); // Atualiza o estado apenas com os favoritos que não são null
                } else {
                    setFavorites([]); // Se não houver dados para esse usuário, define favoritos como uma lista vazia
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
                // Trate os erros como preferir, por exemplo, exibindo uma mensagem de erro para o usuário
            } finally {
                setLoading(false); // Após carregar os favoritos (ou encontrar que não há favoritos), definimos loading como falso
            }
        }
        if (user) {
            loadFavorites();
        }

        return () => { /* Alguma limpeza, se necessário */ };
    }, [user]); // Adicionamos user como uma dependência para que o efeito seja reexecutado quando o usuário mudar

    // Função para remover um favorito
    async function removeFavorite(indexToRemove) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const updatedFavorites = [...favorites];

                // Remova o favorito da lista
                updatedFavorites.splice(indexToRemove, 1);

                // Atualize o documento do usuário no Firestore
                await updateDoc(userDocRef, {
                    fav1: updatedFavorites[0] || null,
                    fav2: updatedFavorites[1] || null,
                    fav3: updatedFavorites[2] || null
                });

                // Atualize o estado local dos favoritos
                setFavorites(updatedFavorites);

                alert('Favorito removido com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
            alert('Erro ao remover favorito.');
        }
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name={t("Favoritos - Top 3")}>
                    <FiStar size={25} />
                </Title>
                {/* Renderização condicional baseada no estado de carregamento */}
                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <div>
                        {/* Renderize os favoritos aqui */}
                        {favorites.filter(favorite => favorite !== null).length === 0 ? (
                            <div className="container-fav">
                                <span>Nenhum favorito adicionado. Adicione na página Pesquisar.</span>
                            </div>
                        ) : (
                            <div className="container-fav">
                                <table>
                                    <tbody>
                                        {favorites.map((favorite, index) => (
                                            favorite !== null && (
                                                <tr key={index}>
                                                    <td className="favorite-content">
                                                        <button className="del-fav" onClick={() => removeFavorite(index)}><FiTrash2 size={25} /></button>
                                                        <span className="favorite-text">{favorite}</span>
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}