const inquirer = require('inquirer');
require('colors');

const questionsOptions = [
    {
        type: 'list',
        pageSize:10,
        name: 'option',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: '1',
                name: '1. Buscar ciudad'
            },
            {
                value: '2',
                name: `${'2.'.green} Historial`
            },
            {
                value: '0',
                name: `${'0.'.green} Salir`
            }            
            
        ]
    }

];


const printMenu = async () => {
    console.clear();
    console.log('========================'.green);
    console.log(' seleccione una opción '.white);
    console.log('========================\n'.green);

   const {option} = await inquirer.prompt(questionsOptions);   
   return option;
}

const pauseMenu = async()=>{
    const question = [
        {
            type: 'input',
            name: 'Enter',
            message: `\nPresione ${'ENTER'.green} para continuar \n`,
    
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}


const readInputMenuOption = async(message)=>{
    const questionRead = [
        {
            type: 'input',
            name: 'description',
            message,
            validate( valueActivity ){
                if(valueActivity.length === 0 ){
                    return 'Por favor ingrese un valor'
                }
                return true;
            }
        }
    ];
    const { description } = await inquirer.prompt(questionRead);
    return description;
    
        
}

const listPlacesMenu = async(places = [])=>{
    const choices = places.map((place, index) =>{
        const indexPlace = `${index+1}.`.green; 
        return {
            value: place.id,
            name:`${indexPlace} ${place.name}`            
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancel'
    });

    const questionPlaces = [
        {
            type: 'list',
            pageSize:10,
            name: 'idPlace',
            message: 'Select Place',
            choices
        }
    ]

    const {idPlace} = await inquirer.prompt(questionPlaces);
    return idPlace;   
};


module.exports = {
    printMenu,
    pauseMenu,
    readInputMenuOption,
    listPlacesMenu    
}