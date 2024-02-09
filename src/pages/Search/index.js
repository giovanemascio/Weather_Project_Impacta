import './search.css'
// import { AuthContext } from '../../contexts/auth'
// import { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSearch, FiGlobe } from 'react-icons/fi'
import { WiHumidity, WiStrongWind, WiCloudy, WiDaySunny, WiRain, WiRainMix, WiCloudyWindy } from "react-icons/wi";
//import br from '../../assets/br.png'
//import vento from '../../assets/vento.png'
import { useState } from 'react';
//import { useEffect } from 'react';
import axios from 'axios';

export default function Search() {

    const { t } = useTranslation();
    const [data, setData] = useState({
        celcius: null,
        name: null,
        humidity: null,
        wind: null,
        image: null
    })
    const [name, setName] = useState('');

    const handleClick = () => {
        if (name !== "") {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=28a56e2ed157bf6285e47f1dfd5a7d74&units=metric`;
            axios.get(apiUrl)
                .then(res => {
                    let imagePath = '';
                    if (res.data.weather[0].main == "Clouds") {
                        imagePath = <WiCloudy />
                    } else if (res.data.weather[0].main == "Clear") {
                        imagePath = <WiDaySunny />
                    } else if (res.data.weather[0].main == "Rain") {
                        imagePath = <WiRain />
                    } else if (res.data.weather[0].main == "Drizzle") {
                        imagePath = <WiRainMix />
                    } else if (res.data.weather[0].main == "Mist") {
                        imagePath = <WiCloudyWindy />
                    } else {
                        imagePath = <WiCloudy />
                    }
                    console.log(res.data);
                    setData({
                        ...data, celcius: res.data.main.temp, name: res.data.name,
                        humidity: res.data.main.humidity, wind: res.data.wind.speed, image: imagePath
                    })
                })
                .catch(err => console.log(err));
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
                            <input type="text" placeholder='Digite o nome da cidade' onChange={e => setName(e.target.value)} />
                            <button type="submit" onClick={handleClick}>
                                <FiSearch size={25} />
                            </button>
                        </div>
                        {data.celcius !== null && data.humidity !== null && data.wind !== null && (
                            <div className="winfo">
                                <div className="iconCondition">
                                    {data.image}
                                </div>
                                <h1>{Math.round(data.celcius)}°</h1>
                                <h2>{data.name}</h2>
                                <div className="details">
                                    <div className="col">
                                        <img alt="" className="iconHum" /> <WiHumidity size={60} />
                                        <div>
                                            <p>{Math.round(data.humidity)}%</p>
                                            <p>Humidade</p>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <img alt="" className="iconWind" /> <WiStrongWind size={50} />
                                        <div>
                                            <p>{Math.round(data.wind)}km/h</p>
                                            <p>Vento</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}