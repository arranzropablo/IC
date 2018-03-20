var path = require("path");
var fs = require('fs');
var _ = require('underscore');

var files = ["AtributosJuego.txt", "Juego.txt"];

if(process.argv.length === 4){
    files = process.argv.splice(2, 2);
}

let atributos = readAndParseToArray(files[0]);

let data = readAndParseToArray(files[1]);

let decision = atributos[atributos.length - 1];

if(data.length !== 0 && atributos.length !== 0){
    let trainingData = parseArrayToTrainingData(atributos, data);
    calculaMerito(atributos, trainingData);
}

/* Funciones (debería modularizarlo a un fichero de utils/IO */

function calculaMerito(atributos, trainingData){
    let claves = atributos.splice(0, atributos.length - 1);
    let meritos = {}
    claves.forEach(clave => {
        let branches = _.uniq(trainingData.map(element => element[clave]));
        let merito = 0;
        branches.forEach(branch => {
            let a = trainingData.filter(data => data[clave] === branch).length;
            let p = trainingData.filter(data => data[clave] === branch && data[decision].toUpperCase() === "SI").length / a;
            let n = trainingData.filter(data => data[clave] === branch && data[decision].toUpperCase() === "NO").length / a;
            let r = a / trainingData.length;
            merito += (r *entropia(p, n));
        })
        meritos[clave] = merito;
        //meritos[clave] = ri * entropia(p, n);
    })
    /*
    merito = {}
    trainingData
    */
}

function entropia(p, n){
    return -p*fixedLog(p) - n*fixedLog(n);
}

function fixedLog(number){
    let aasd = Math.log2(number)
    //ver como puedo hacer para no devolver un valor concreto... sino devolver algo concreto porqe se va a multiplicar * 0
    let fasafa = aasd === -Infinity ? Number.NEGATIVE_INFINITY : Math.log2(number)
    return fasafa;
}

function parseArrayToTrainingData(atributos, data){
    let trainingData = [];
    for (let i = 0; i < data.length - atributos.length + 1; i++){
        let trainingItem = {};
        for (let j = 0; j < atributos.length; j++){
            //recorre tantas posiciones como haya en el array de atributos para guardar un item
            trainingItem[atributos[j]] = data[i];
            i++;
        }
        i--;
        trainingData.push(trainingItem);
    }
    return trainingData;
}

function readAndParseToArray(fileName){
    let content;
    try{
        content = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8');
    } catch (err) {
        console.log("Error leyendo el archivo " + fileName);
        return [];
    }
    //reemplaza saltos de linea por "," y quita las posiciones vacias
    return content.replace(/(\r\n)/g,",").split(",").filter(data => data !== "");
}