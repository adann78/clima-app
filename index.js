
const {inquirerMenu, leerInput, pausa, listarLugares } = require('./helpers/inquirer')
const Busquedas=require('./models/busquedas.js')
console.log(process.env.MAPBOX_KEY);
require ('colors')

const main= async()=>{
    const busquedas=new Busquedas();
    const busquedasc=new Busquedas();
    let opt;
    do{
        opt=await inquirerMenu()
        switch( opt ){
            case 1:
                 //Mostrar mensaje
                const termino=await leerInput('Ciudad:')
                  //Buscar los lugares
                const lugares=await busquedas.ciudad(termino);
                             
              
                //Seleccionar el lugar
                const id=await listarLugares(lugares);
                if(id==='0') continue;
                //guardarDB

                
                const lugarSel=lugares.find(l=>l.id===id)
                busquedas.agregarHistorial(lugarSel.nombre)
                
                const clima=await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                //Clima
                //Mostrar resultados
                    console.log('\nInformacion de la ciudad\n'.green)
                    console.log('Ciudad:', lugarSel.nombre.blue)
                    console.log('Lat:', lugarSel.lat)
                    console.log('Lng:', lugarSel.lng)
                    console.log('Temperatura:',clima.temp)
                    console.log('Mínima:',clima.min)
                    console.log('Máxima:',clima.max)
                    console.log('Como esta el clima:',clima.desc)
            break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i)=>{
                    const idx=`${i+1}. `.green
                    console.log( `${idx} ${ lugar } `  );
                })
            break;

        }
        console.log({opt})
        if (opt !==0) await pausa()
    } while(opt!==0);
}



main();