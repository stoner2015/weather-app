const {
    readInputMenuOption,
    printMenu,
    pauseMenu,
    listPlacesMenu
} = require('./helpers/inquiere');
const Searches = require('./models/searches');


const main = async () => {
    let option = '';

    const searches = new Searches();

    let message = '';
    do {
        option = await printMenu();
        switch (option) {
            case '1':
                //mostrar mensaje
                const itemPlace = await readInputMenuOption('place city: ');

                //search place
                const places = await searches.city(itemPlace);

                //select place
                const idPlace = await listPlacesMenu(places);
                if (idPlace === '0') continue;
                const selectPlace = places.find(place => place.id === idPlace);

                searches.addRecordsSearch(selectPlace.name);

                //consumer API Weather Page API
                const weatherPlace = await searches.weatherPlace(selectPlace.lat, selectPlace.lng);

                console.clear();
                console.log('\nInformation of the city\n'.green);
                console.log('City:', selectPlace.name.green);
                console.log('Latitud:', selectPlace.lat);
                console.log('longitud:', selectPlace.lng);
                console.log('Temperatura:', weatherPlace.temp);
                console.log('Min:', weatherPlace.temp_min);
                console.log('Max:', weatherPlace.temp_max);
                console.log('description:', weatherPlace.description.green);

                break;
            case '2':
                if (searches.camelRecords.length > 0) {

                    searches.camelRecords.forEach((place, indexPlace) => {
                        const indexPlaceConsole = `${indexPlace + 1}.`.green;
                        console.log(`${indexPlaceConsole} ${place} `);
                    })

                }

                break;
            default:
                break;
        }
        await pauseMenu();

    } while (option !== '0');

}

main();