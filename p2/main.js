var Node = require("tree-node");
var draw_tree = require('asciitree');
var utils = require("./utils")
var id3 = require("./ID3")

var files = ["AtributosJuego.txt", "Juego.txt"];
let dataToTest;

//en vez de leer los archivos leer un ejemplo y que diga si se juega o no se juega
if(process.argv.length === 6){
    dataToTest = process.argv.splice(2, 4);
}

let atributos = utils.readAndParseToArray(files[0]);
let data = utils.readAndParseToArray(files[1]);
let decision = atributos[atributos.length - 1];
let node = new Node();

id3 = new id3.ID3(decision);

if(data.length !== 0 && atributos.length !== 0){
    let trainingData = utils.parseArrayToTrainingData(atributos, data);
    let printable = [];
    id3.id3algorithm(atributos, trainingData, node);
    printable.push(node.json.childs[node.json.childIdsList[0]].data.name.toUpperCase());
    utils.transformNodesToPrintable(node.json.childs[node.json.childIdsList[0]], printable);
    console.log(draw_tree(printable));
}

if(dataToTest != null || dataToTest != undefined){
    let result = utils.guessResult(dataToTest, node.json.childs[node.json.childIdsList[0]]);
    if (result === "+"){
        console.log("Es apropiado salir a jugar");
    } else if (result === "-"){
        console.log("No es apropiado salir a jugar");
    }
}