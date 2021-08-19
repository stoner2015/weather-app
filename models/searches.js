
const fs = require('fs');
const axios = require('axios');

require('dotenv').config()

class Searches {
    records = [];
    dbPath = './db/database.json';

    constructor() {
        this.readData();
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    get camelRecords() {
        //teacher code
        return this.records.map(place => {
            let words = place.split(' ');
            words = words.map(word => word[0].toUpperCase()+ word.substring(1));
            return words.join(' ');
        })

        //my code for the task
        /*if (this.records.length > 0) {

            this.records.forEach((place, indexPlace) => {
                const indexPlaceConsole = `${indexPlace + 1}.`.green;
                if (place !== '') {
                    const camel = place.split(',');
                    let placeArray = '';
                    camel.forEach((placeCap) => {
                        placeArray += `${this.capitalizeFirstLetter(placeCap.trim())}, `;
                        // console.log('union:'+ placeArray);
                    })
                    placeArray = placeArray.slice(0, placeArray.trim().length - 1);
                    place = placeArray;
                }
                console.log(`${indexPlaceConsole} ${place} `);
            })

        }
        return this.records;*/ 
    }

    capitalizeFirstLetter(string) {
        // console.log('capitalizeFirstLetter:'+ string.charAt(0).toUpperCase() + string.slice(1));
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    async city(place = '') {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?`,
                params: this.paramsMapBox
            });
            // console.log(process.env.MAPBOX_KEY);
            // const response = await axios.get('https://reqres.in/api/users?page=2');
            // const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Praga%2C%20Praga%2C%20Rep%C3%BAblica%20Checa.json?access_token=pk.eyJ1IjoiamF2aWVycm9kcmlndWV6MDQiLCJhIjoiY2txeDl5cnc1MGswbDJubnYydG9pcXEwdiJ9.Qzc-_12yLy-Qk7Ou30eTIg&limit=5&language=es');
            const response = await instance.get();
            // console.log(response.data.features);
            return response.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }));
            // return[]

        } catch (error) {
            console.log('what happend place' + error);
            return [];
        }

    }

    async weatherPlace(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            });
            //  const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=4.73056&lon=-74.26389&appid=8146d708799363edd99f4f97cc4aaf85&units=metric&lang=es');
            const response = await instance.get();
            const { main, weather } = response.data;
            return {
                temp: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max,
                description: weather[0].description
            }

        } catch (error) {
            console.log('what happend weather' + error);
            return [];
        }

    }

    addRecordsSearch(place = '') {

        if (this.records.includes(place.toLocaleLowerCase())) {
            return;
        }
        this.records = this.records.splice(0,5);

        this.records.unshift(place.toLocaleLowerCase());
        this.saveDataHistory();
        //grabar en db
    }

    saveDataHistory() {

        const payload = {
            records: this.records
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readData() {
        console.log('##########Ingrese a leer data');        
        if (!fs.existsSync(this.dbPath)) {
            console.log('##### error');
            return;
        }

        const informationFile = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });        
        const data = JSON.parse(informationFile);
        this.records = data.records;
        
    }

}

module.exports = Searches;