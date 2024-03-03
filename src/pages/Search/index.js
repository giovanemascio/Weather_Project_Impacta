import './search.css'
// import { AuthContext } from '../../contexts/auth'
// import { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSearch, FiStar, FiGlobe } from 'react-icons/fi'
import { WiHumidity, WiStrongWind, WiCloudy, WiDaySunny, WiRain, WiRainMix, WiCloudyWindy } from "react-icons/wi";
import { MdOutlineCleaningServices } from "react-icons/md";
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { db, storage } from '../../services/firebaseConnection'
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../../contexts/auth'


export default function Search() {
    const { t } = useTranslation();
    const STORAGE_KEY = "userLanguage";
    const storedLanguage = localStorage.getItem(STORAGE_KEY);

    const [showAddToFavoritesButton, setShowAddToFavoritesButton] = useState(false);
    const { user, storageUser, setUser } = useContext(AuthContext);

    const [data, setData] = useState({
        celcius: null,
        name: null,
        humidity: null,
        wind: null,
        desc: null,
        iconName: null,
        searchTime: null
    });

    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [userFavData, setUserFavData] = useState(null);
    const [userFavorites, setUserFavorites] = useState([]);

    useEffect(() => {
        async function loadUserFavData() {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const userFavorites = Object.values(userData)
                        .filter(favorite => favorite !== null && favorite !== user.nome && favorite !== user.avatarUrl); // Excluindo o nome do usuário

                    setUserFavorites(userFavorites);
                } else {
                    setUserFavorites([]); // Se não houver dados para esse usuário, define os favoritos como uma lista vazia
                }
            } catch (error) {
                console.error('Error fetching user favorites:', error);
                // Trate os erros como preferir, por exemplo, exibindo uma mensagem de erro para o usuário
            }
        }

        loadUserFavData();
    }, [user.uid]); // Atualizar quando o ID do usuário mudar

    const handleClick = (cityName = null) => {
        const cityNameToSearch = cityName || name; // Use o cityName se estiver presente, caso contrário, use o nome no estado

        if (cityNameToSearch !== "") {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameToSearch}&appid=28a56e2ed157bf6285e47f1dfd5a7d74&units=metric&lang=${storedLanguage}`;

            axios.get(apiUrl)
                .then(res => {
                    const now = new Date();
                    const formattedTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
                    let iconName = null;
                    if (res.data.weather[0].main === "Clouds") {
                        iconName = 'WiCloudy';
                    } else if (res.data.weather[0].main === "Clear") {
                        iconName = 'WiDaySunny';
                    } else if (res.data.weather[0].main === "Rain") {
                        iconName = 'WiRain';
                    } else if (res.data.weather[0].main === "Drizzle") {
                        iconName = 'WiRainMix';
                    } else if (res.data.weather[0].main === "Mist") {
                        iconName = 'WiCloudyWindy';
                    } else {
                        iconName = 'WiCloudy';
                    }
                    console.log(res.data);
                    setData({
                        celcius: res.data.main.temp,
                        name: res.data.name,
                        humidity: res.data.main.humidity,
                        wind: res.data.wind.speed,
                        desc: res.data.weather[0].description,
                        iconName: iconName,
                        searchTime: formattedTime
                    });

                    setShowAddToFavoritesButton(true);
                    setError('');
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        setError(t("Nome da cidade inválido!"));
                    } else {
                        setError('');
                    }
                    console.log(err);
                });
        }
    };

    // Função para Limpar:
    const handleClear = () => {
        setData({
            celcius: null,
            name: null,
            humidity: null,
            wind: null,
            desc: null,
            iconName: null,
            searchTime: null
        });
        setName('');
        localStorage.removeItem('searchData');
    };

    // Função Add Favoritos:
    async function handleAddFav(cityName) {
        //alert(`Adicionar "${name}" ao Top 3 favoritos`);
        try {
            const userDocRef = doc(db, "users", user.uid); // Referência ao documento do usuário
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) {
                throw new Error('Documento do usuário não encontrado');
            }

            const userFavData = userDocSnap.data(); // Dados do usuário

            // Verificar se o favorito já está na lista
            const favIndex = ['fav1', 'fav2', 'fav3'].findIndex(fav => userFavData[fav] === cityName);
            if (favIndex !== -1) {
                throw new Error('Esta localidade já está nos favoritos');
            }

            // Verificar se há espaço para adicionar o novo favorito
            const emptyFavIndex = ['fav1', 'fav2', 'fav3'].findIndex(fav => !userFavData[fav]);
            if (emptyFavIndex === -1) {
                throw new Error('Você já tem 3 favoritos. Remova um para adicionar outro.');
            }

            const favField = `fav${emptyFavIndex + 1}`;
            await updateDoc(userDocRef, {
                [favField]: cityName
            });

            // Recarregar os dados do usuário após a atualização
            //const updatedUserDocSnap = await getDoc(userDocRef);
            //const updatedUserFavData = updatedUserDocSnap.data();

            // Atualizar localmente os favoritos do usuário
            // Atualizar localmente a lista de favoritos do usuário
            setUserFavorites(prevFavorites => [...prevFavorites, cityName]);

            alert(`Adicionado "${cityName}" aos favoritos.`);
        } catch (error) {
            console.error('Erro ao adicionar favorito:', error.message);
            alert('Erro ao adicionar favorito: ' + error.message);
        }
    }


    return (
        <div>
            <Header />
            <div className="content">
                <Title name={t("Pesquisar")}>
                    <FiGlobe size={25} />
                </Title>
                <div className="containerSearch">
                    <div className="weather">
                        <div className="search">
                            <input
                                type="text"
                                placeholder={t('Digite o nome da localidade')}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Evita o comportamento padrão de submissão do formulário
                                        handleClick(); // Chama a função de clique quando "Enter" é pressionado
                                    }
                                }}
                            />
                            <button type="submit" onClick={handleClick}>
                                <FiSearch size={25} />
                            </button>
                            <button type="submit" onClick={handleClear}>
                                <MdOutlineCleaningServices size={25} />
                            </button>
                        </div>
                        {data.celcius !== null && data.humidity !== null && data.wind !== null && data.desc !== null && !error && (
                            <div className="winfo">
                                <div className="iconCondition">
                                    {data.iconName === 'WiCloudy' && <WiCloudy />}
                                    {data.iconName === 'WiDaySunny' && <WiDaySunny />}
                                    {data.iconName === 'WiRain' && <WiRain />}
                                    {data.iconName === 'WiRainMix' && <WiRainMix />}
                                    {data.iconName === 'WiCloudyWindy' && <WiCloudyWindy />}
                                </div>
                                <h2 style={{ marginTop: "-30px", fontSize: "30px" }}>{data.desc}</h2>
                                <h1 style={{ marginTop: "25px" }}>{Math.ceil(data.celcius)}°</h1>
                                <h2>{data.name}</h2>
                                <div className="details">
                                    <div className="col">
                                        <img alt="" className="iconHum" /> <WiHumidity size={60} />
                                        <div>
                                            <p>{Math.ceil(data.humidity)}%</p>
                                            <p>{t("Humidade")}</p>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <img alt="" className="iconWind" /> <WiStrongWind size={50} />
                                        <div>
                                            <p>{Math.ceil(data.wind)}km/h</p>
                                            <p>{t("Vento")}</p>
                                        </div>
                                    </div>
                                </div>
                                <p style={{ marginTop: "-15px", fontSize: "15px" }}>{t("Atualizado")}: {data.searchTime} </p>
                                {showAddToFavoritesButton && (
                                    <button button type="submit" className="btn-add-fav" onClick={() => handleAddFav(name)}>{t("Adicionar ao Top 3 favoritos")}</button>
                                )}

                            </div>

                        )}
                        {error && (
                            <div className="error">
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="container-fav">
                    <FiStar color="#121212" size={22} style={{ marginRight: '5px', fill: '#121212' }} />
                    {userFavorites.map((favorite, index) => (
                        <button key={index} type="submit" className="fav-btn" onClick={() => handleClick(favorite)}>
                            {favorite}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}