import './search.css'
// import { AuthContext } from '../../contexts/auth'
// import { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSearch, FiGlobe } from 'react-icons/fi'
import { WiHumidity, WiStrongWind, WiCloudy, WiDaySunny, WiRain, WiRainMix, WiCloudyWindy } from "react-icons/wi";
import { MdOutlineCleaningServices } from "react-icons/md";
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function Search() {
    const { t } = useTranslation();
    const STORAGE_KEY = "userLanguage";
    const storedLanguage = localStorage.getItem(STORAGE_KEY);

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

    const handleClick = () => {
        if (name !== "") {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=28a56e2ed157bf6285e47f1dfd5a7d74&units=metric&lang=${storedLanguage}`;//&lang=${storedLanguage}
            axios.get(apiUrl)
                .then(res => {
                    const now = new Date(); // Obtenha a hora atual
                    const formattedTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`; // Formate a hora como desejar
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

                    // Armazene a hora da consulta
                    //setSearchTime(formattedTime);

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
                                placeholder='Digite o nome da cidade'
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
                            </div>
                        )}
                        {error && (
                            <div className="error">
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}