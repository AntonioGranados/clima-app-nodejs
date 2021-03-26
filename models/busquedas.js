//importamos el filesystem
const fs = require('fs');

//importamos la dependencia de axios
const axios = require('axios');

//Creamos la clase busqueda
class Busquedas {

    //propiedad historial para almacenar el historial de las busquedas
    historial = [];

    //ruta donde estara el archivo con la informacion guardada
    rutaDB = './db/database.json';

    constructor() {
        this.leerDeLaBaseDeDatos();
    }

    //getter para controlar los parametros necesarios para realizar la peticion en axios
    get parametrosDeMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    //getter para controlar los parametros necesarios para realizar la peticion en axios
    get parametrosDeOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric' 
        }
    }

    //getter para capitalizar cada palabra de la busqueda 
    get capitalizarHistorial() {
        //pasamos el historial por map para crear un nuevo arreglo
        return this.historial.map(lugar => {
            //tomamos las palabras y los separamos con un espacio en un arreglo 
            let palabras = lugar.split(' ');

            //tomamos las palabras para transformar la primera letra en mayuscula y le agregamos el resto
            //de la palabra
            palabras = palabras.map(palabra => palabra[0].toUpperCase() + palabra.substring(1));

            //unimos nuevamente con un espacio las palabras
            return palabras.join(' ');
        });
    }

    //Metodo para buscar un lugar o ciudad
    async buscarLugar(lugarABuscar) {

        try {
            //peticion http, creamos una nueva instancia de axios para manejar la url y sus parametros
            const nuevaInstanciaDeAxios = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugarABuscar}.json`,
                params: this.parametrosDeMapbox
            });

            //obtenemos la respuesta de la peticion http
            const respuestaDeLaPeticion = await nuevaInstanciaDeAxios.get();
            
            //retornamos los features que es un arreglo con la informacion de los lugares
            //con map generamos un nuevo arreglo unicamente con la informacion que necesitamos
            return respuestaDeLaPeticion.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                longitud: lugar.center[0],
                latitud: lugar.center[1]
            }));

            // //retornar los lugares que coincidan con el lugarABuscar
            // return [];
            
        } catch (error) {
            return [];
        }
    }

    async climaDelLugar(latitud, longitud) {
        try {
            //peticion http, creamos una nueva instancia de axios para manejar la url y sus parametros
            const nuevaInstanciaDeAxios = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}`,
                params: this.parametrosDeOpenWeather
            });

            //obtenemos la respuesta de la peticion http
            const respuestaDeLaPeticion = await nuevaInstanciaDeAxios.get();

            //obtenemos la informacion que necesitamos de la respuesta
            const { weather, main } = respuestaDeLaPeticion.data;

            //retornamos el objeto con la informacion que queremos mostrar
            return {
                descripcion: weather[0].description, //weather es un arreglo de objetos
                temperatura: main.temp, //main es un objeto que contiene la informacion del clima
                temperaturaMinima: main.temp_min, //main es un objeto que contiene la informacion del clima
                temperaturaMaxima: main.temp_max //main es un objeto que contiene la informacion del clima
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Metodo para guardar el historial de las busquedas
    agregarHistorial(lugarAGuardarEnHistorial) {
        //Evitar duplicados en el historial, es decir busquedas repetidas
        //si ya existe el lugar hacemos un return para que no haga nada
        if (this.historial.includes(lugarAGuardarEnHistorial.toLocaleLowerCase())) {
            return
        }

        //para mantener solo 6 registros en el historial, usamos splice para cortar de la poscion 0 a la 5
        this.historial = this.historial.splice(0,5);

        //Agregamos las busquedas al arreglo de historial
        this.historial.unshift(lugarAGuardarEnHistorial.toLocaleLowerCase());

        //Grabar en BD
        this.guardarEnBaseDeDatos();
    }

    guardarEnBaseDeDatos() {

        //guardamos en una propiedad el historial
        const payload = {
            historial: this.historial
        };

        //grabamos lo que esta en el historial en el arhcivo js como db
        fs.writeFileSync(this.rutaDB, JSON.stringify(payload));
    }

    leerDeLaBaseDeDatos() {
        //si el archivo no existe, retornamos null para no hacer nada
        if (!fs.existsSync(this.rutaDB)) {
            return null;
        }

        //Leemos la informacion del archivo
        const informacionDelArchivo = fs.readFileSync(this.rutaDB, {encoding: 'utf-8'});

        //convertimos la informacion del archivo en un json
        const datosDelArchivo = JSON.parse(informacionDelArchivo);

        //con la informacion que viene en datosDelArchivo extraemos el historial
        this.historial = datosDelArchivo.historial;
        console.log(datosDelArchivo);
    }
}

module.exports = Busquedas;