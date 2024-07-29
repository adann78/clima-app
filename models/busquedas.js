const fs=require('fs')
require('dotenv').config()
const axios = require('axios');
class Busquedas{
historial=[]
dbPath='./db/database.json'
constructor() {
    //TODO LEER db si existe
    this.leerDB();
}
get historialCapitalizado(){
    return this.historial.map(lugar=>{
        let palabras=lugar.split(' ');
        palabras=palabras.map(p=>p[0].toUpperCase()+ p.substring(1));
        return palabras.join(' ')
    })
}

get paramsMapbox(){
    return {
        'access_token':process.env.MAPBOX_KEY, 
        'proximity': 'ip',
        'language': 'es'

    } 
}
async ciudad( lugar = '' ){
    //peticion HTTP
    try{
    
        const instance=axios.create({
        baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
        params:this.paramsMapbox    
        
    })
    const resp= await instance.get()      
    
    
    return (resp.data.features).map(lugar=>({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]
    }));
    
    
    }catch (error){
        return[];    
    }
    
       
}
get paramsWeather(){
    return {
    appid:process.env.OPENWEATHER_KEY,
    units: 'metric',
    lang: 'es'
}
}

async climaLugar(lat, lon){
    try{
    const instance=axios.create({
        baseURL:`https://api.openweathermap.org/data/2.5/weather`,
        params: {...this.paramsWeather, lat, lon}
            
        
    })
    

        const resp= await instance.get()   
        const {weather, main}=resp.data            
        return{
            desc: weather[0].description,
            min: main.temp_min,
            max: main.temp_max,
            temp: main.temp
            
        
        }
        
    }catch(error){
        

            return[];    
        }   
    }

        agregarHistorial(lugar=''){
            if(this.historial.includes(lugar.toLocaleLowerCase())){
                return;
            }
                this.historial.unshift(lugar.toLocaleLowerCase())
                this.guardarDB()

        }
        guardarDB(){
            const payload={
                historial: this.historial
            }
            fs.writeFileSync(this.dbPath, JSON.stringify(payload));
        }
        leerDB(){
            if(!fs.existsSync(this.dbPath)) return;
            const info=fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
            const data= JSON.parse(info);
            this.historial=data.historial;
        }

}

//retornar los luhgres





module.exports=Busquedas;