//importamos inquirer
const inquirer = require('inquirer');

//importamos colors
const colors = require('colors');

//creamos las preguntas del menu
const preguntasDelMenu = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué Desea Hacer?',
        choices: [
            {
                value: 1,
                name: `${colors.yellow('1.')} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${colors.yellow('2.')} Historia de Búsqueda`
            },
            {
                value: 0,
                name: `${colors.yellow('0.')} Salir`
            }
        ]
    }
];

//Mostramos la opcion cuando se pause el menu
const pregunta = [
    {
        type: 'input',
        name: 'enter',
        message: `Presione ${colors.green('ENTER')} para continuar`
    }
]

//creacion del menu
const inquirerMenu = async() => {
    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción   '.white);
    console.log('==========================\n'.green);
    
    //Desestructuramos para que nos muestre unicamente la opcion que seleccionemos
    const {opcion} = await inquirer.prompt(preguntasDelMenu);

    return opcion;
}

//Pausamos el menu para cuando el usuario seleccione una opcion, no vuelva a mostrar el menu,
//si no deje realizar la accion correspondiente
const pausarMenu = async() => {

    console.log('\n');
    const {enter} = await inquirer.prompt(pregunta);
    
    return enter;
}

//leemos el input donde el usuario ingresara el lugar que quiere buscar
const leerInputDeBuscarLugar = async(mensaje) => {
    const pregunta = [
        {
            type: 'input',
            name: 'descripcion',
            message: mensaje,
            validate(value) {
                if (value.length === 0) {
                    return 'El lugar no puede estar vacío, por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {descripcion} = await inquirer.prompt(pregunta);
    return descripcion;
}

//Listar los lugares para seleccionar el lugar que queremos
const listarLugares = async(lugares = []) => {
    //Recorremos los lugares para generar un nuevo arreglo con la informacion que queremos, en este caso
    //id y nombre del lugar
    const opciones = lugares.map((lugar, index) => {
        //generamos un contador
        const contador = `${colors.yellow(index + 1 + '.')}`;

        //retonamos el id y el nombre del kugar
        return {
            value: lugar.id,
            name: `${contador} ${lugar.nombre}`
        }
    });
    //Agregamos la opcion 0 para regresar al menu de inicio
    opciones.unshift({
        value: '0',
        name: `${colors.yellow(`0.`)} Cancelar`
    });
    //Generamos las preguntas que va a contener el listado de lugares para el inquierer.prompt
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccion lugar',
            choices: opciones
        }
    ]
    //mostramos en consola
    const {id} = await inquirer.prompt(preguntas);
    return id;
}

//Mostrar el mensaje para confirmar una eliminacion de tareas
const confirmarEliminacionDeTarea = async(mensajeDeConfirmacion) => {
    
    //definimos la pregunta para confirmar la eliminacion de tipo confirm
    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensajeDeConfirmacion
        }
    ];

    //mostramos en consola
    const {ok} = await inquirer.prompt(pregunta);
    return ok;
}

//mostramos un check list para seleccionar multipleas tareas
const mostrarCheckListDeTareas = async(tareas = []) => {

    //Recorremos las tareas para generar un nuevo arreglo con el id y la desc de la tarea
    const opciones = tareas.map((tarea, index) => {

        //generamos un contador
        const contador = `${colors.yellow(index + 1 + '.')}`;

        //retonamos el id de la tarea y la descripcion y validamos si completadoEn existe
        //lo ponemos en true y de esta manera las tareas completadas, si no sería false
        //Apareceran checkeadas
        return {
            value: tarea.id,
            name: `${contador} ${tarea.descripcionTarea}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });

    //Generamos las preguntas que va a contener el listado de tareas para el inquierer.prompt
    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices: opciones
        }
    ]

    //mostramos en consola
    const {ids} = await inquirer.prompt(preguntas);
    return ids;
}

module.exports = {
    inquirerMenu,
    pausarMenu,
    leerInputDeBuscarLugar,
    listarLugares,
    confirmarEliminacionDeTarea,
    mostrarCheckListDeTareas
}