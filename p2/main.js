var Node = require("tree-node");
var draw_tree = require('asciitree');
var utils = require("./utils")
var id3 = require("./ID3")

var files = ["AtributosJuego.txt", "Juego.txt"];

if(process.argv.length === 4){
    files = process.argv.splice(2, 2);
}

let atributos = utils.readAndParseToArray(files[0]);
let data = utils.readAndParseToArray(files[1]);
let decision = atributos[atributos.length - 1];

id3 = new id3.ID3(decision);

if(data.length !== 0 && atributos.length !== 0){
    let trainingData = utils.parseArrayToTrainingData(atributos, data);
    let node = new Node();
    let printable = [];
    id3.id3algorithm(atributos, trainingData, node);
    printable.push(node.json.childs[node.json.childIdsList[0]].data.name.toUpperCase());
    utils.transformNodesToPrintable(node.json.childs[node.json.childIdsList[0]], printable);
    console.log(draw_tree(printable));
}