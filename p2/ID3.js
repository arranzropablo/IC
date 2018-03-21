var path = require("path");
var fs = require('fs');
var _ = require('underscore');
var Node = require("tree-node");
var draw_tree = require('asciitree');

var files = ["AtributosJuego.txt", "Juego.txt"];

if(process.argv.length === 4){
    files = process.argv.splice(2, 2);
}

let atributos = readAndParseToArray(files[0]);
let data = readAndParseToArray(files[1]);
let decision = atributos[atributos.length - 1];

if(data.length !== 0 && atributos.length !== 0){
    let trainingData = parseArrayToTrainingData(atributos, data);
    let node = new Node();
    let printable = [];
    ID3(atributos, trainingData, node);
    //esto tiene qe qedar
    console.log(draw_tree(["________tiempo exterior",["soleado",["humedad",["alta", "-"], ["normal", "+"]]],
                            ["nublado", "+"],
                            ["lluvioso",["viento", ["falso", "+"],["verdad", "-"]]]]));
    transformNodesToPrintable(node.json.childs[node.json.childIdsList[0]], printable);
}

/* Funciones (debería modularizarlo a un fichero de utils/IO */

function transformNodesToPrintable(tree, printable){
    //si todos los hijos tienen - o + hacemos un array con todos y pa pribtable
    //tree.childs.map(child => child.data())
    //let claveshijos = tree.childIdsList;
    //let hijos = tree.childs;
    //let primerhijo = tree.childs[claveshijos[0]];
    //let dataprimerhijo = primerhijo.data;

    if (tree.childIdsList.every(childkey => tree.childs[childkey].data.name === "+" || tree.childs[childkey].data.name === "-" || tree.childs[childkey].data.name === "no data")) {
        printable.push(tree.data.name);
        let leafs = tree.childIdsList.forEach(childkey => printable.push([tree.childs[childkey].data.comingFrom, tree.childs[childkey].data.name]));
        //aqui pinto las hojas
        /*

             root
            /    \
          alta normal
            |     |
            -     +

        printable.push("root");
        leafs.forEach(leaf => printable.push(leaf));
        console.log(printable);
        console.log(draw_tree(printable));
        */
    } else if (tree.data.name === "+" || tree.data.name === "-" || tree.data.name === "no data") {
        printable.push(tree.data.name);
    } else {
        tree.childIdsList.forEach(childkey => {
            //pintarme en un papel como tiene q qedar el array para hacerlo
            transformNodesToPrintable(tree.childs[childkey],printable)
        });
    }
}

function ID3(atributos, trainingData, node, comingFrom){
    let newNode = new Node();
    newNode.data("comingFrom", comingFrom);
    node.appendChild(newNode);

    if(trainingData.length <= 0){
        newNode.data("name", "no data");
        newNode.data("branches", []);

    } else if (trainingData.every(data => data[decision].toUpperCase() === "SI")){
        newNode.data("name", "+");
        newNode.data("branches", []);

    } else if (trainingData.every(data => data[decision].toUpperCase() === "NO")){
        newNode.data("name", "-");
        newNode.data("branches", []);

    } else {
        let meritos = calculaMeritos(atributos, trainingData);
        let min = {merito: Number.MAX_SAFE_INTEGER};
        meritos.forEach(val => {
            if (val.merito < min.merito){
                min = val;
            }
        });
        newNode.data("name", min.name);
        newNode.data("branches", min.branches);
        min.branches.forEach(branch =>{
            ID3(atributos.filter(attr => attr.toUpperCase() !== min.name.toUpperCase()), trainingData.filter(data => data[min.name].toUpperCase() === branch.toUpperCase()), newNode, branch);
        });
    }
}

function calculaMeritos(atributos, trainingData){
    let claves = atributos.slice(0, atributos.length - 1);
    let meritos = [];
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
        meritos.push({name: clave, merito: merito, branches: branches});
    });
    return meritos;
}

function entropia(p, n){
    return -p*fixedLog(p) - n*fixedLog(n);
}

function fixedLog(number){
    return Math.log2(number) === -Infinity ? Number.MAX_SAFE_INTEGER : Math.log2(number)
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