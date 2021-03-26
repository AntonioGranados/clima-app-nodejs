const { inquirerMenu, leerInputDeBuscarLugar, pausarMenu, listarLugares} = require('./helpers/inquirer');
const colors = require('colors');
const Busquedas = require('./models/busquedas');

//Usamos dotenv para trabajar con variables de entorno
require('dotenv').config();

const main = async() => {
    
    //Creamos una variable para controlar las opciones
    let opciones;

    //creamos una nueva instancia de busquedas
    const busquedas = new Busquedas();

    //Cliclo para mostrar el menu
    do {
        //mostramos el menu en consola
        opciones = await inquirerMenu(); 

        //controlamos las opciones del menu
        switch (opciones) {
            case 1:
                //Mostar el mensaje para que el usuario escriba el lugar a buscar 
                const buscarCiudadOLugar = await leerInputDeBuscarLugar('Ingrese lugar a buscar: ');
                
                //Buscar los lugares
                //Metodo para mostrar los resultados del lugar a buscar
                const lugares = await busquedas.buscarLugar(buscarCiudadOLugar);

                //Seleccionar el lugar deseado
                const idDeLugarSeleccionado = await listarLugares(lugares);
                
                //Si al buscar el lugar seleccionamos la opcion 0 (cancelar), mostramos el menu nuevamente
                if (idDeLugarSeleccionado === '0') continue;

                //mostrar la informacion del lugar seleccionado
                const lugarSeleccionado = lugares.find(lugar => lugar.id  === idDeLugarSeleccionado);

                //Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                //Mostramos la informacion del clima del lugar seleccionado
                const climaDelLugarSeleccionado = await busquedas.climaDelLugar(lugarSeleccionado.latitud, lugarSeleccionado.longitud);

                //Mostrar los resultados
                console.clear();
                console.log(`${colors.green('\nInformación del lugar\n')}`);
                console.log(`Lugar/Ciudad: ${colors.green(lugarSeleccionado.nombre)}` );
                console.log('Latitud: ', lugarSeleccionado.latitud);
                console.log('Longitud: ', lugarSeleccionado.longitud);
                console.log(`Temperatura: ${colors.yellow(climaDelLugarSeleccionado.temperatura + '°C')}`);
                console.log(`Temperatura Mínima: ${colors.yellow(climaDelLugarSeleccionado.temperaturaMinima + '°C')}`);
                console.log(`Temperatura Máxima: ${colors.yellow(climaDelLugarSeleccionado.temperaturaMaxima + '°C')}`);
                console.log(`Clima Actual: ${colors.green(climaDelLugarSeleccionado.descripcion)}`);
                break;
            
            case 2:
                //mostramos el historial de busquedas recorriendo el arreglo de historial
                busquedas.capitalizarHistorial.forEach((lugar, index) => {
                    //contador para enumerar los lugares
                    const contador = `${colors.yellow(index + 1 + '.')}`;
                    console.log(`${contador} ${lugar}`);
                });
                break;
        }

        //pausamos el menu cuando el usuario seleccione una opcion
        await pausarMenu();

    } while(opciones !== 0); //si la opcion es 0, nos salimos de la aplicacion

}

main();
