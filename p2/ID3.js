var Node = require("tree-node");
var _ = require('underscore');

class ID3 {
    
    constructor(decision){
        this.decision = decision;
    }

    id3algorithm(atributos, trainingData, node, comingFrom){
        let newNode = new Node();
        newNode.data("comingFrom", comingFrom);
        node.appendChild(newNode);
    
        if(trainingData.length <= 0){
            newNode.data("name", "no data");
            newNode.data("branches", []);
    
        } else if (trainingData.every(data => data[this.decision].toUpperCase() === "SI")){
            newNode.data("name", "+");
            newNode.data("branches", []);
    
        } else if (trainingData.every(data => data[this.decision].toUpperCase() === "NO")){
            newNode.data("name", "-");
            newNode.data("branches", []);
    
        } else {
            let meritos = this.calculaMeritos(atributos, trainingData);
            let min = {merito: Number.MAX_SAFE_INTEGER};
            meritos.forEach(val => {
                if (val.merito < min.merito){
                    min = val;
                }
            });
            newNode.data("name", min.name);
            newNode.data("branches", min.branches);
            min.branches.forEach(branch =>{
                this.id3algorithm(atributos.filter(attr => attr.toUpperCase() !== min.name.toUpperCase()), trainingData.filter(data => data[min.name].toUpperCase() === branch.toUpperCase()), newNode, branch);
            });
        }
    }
    
     calculaMeritos(atributos, trainingData){
        let claves = atributos.slice(0, atributos.length - 1);
        let meritos = [];
        claves.forEach(clave => {
            let branches = _.uniq(trainingData.map(element => element[clave]));
            let merito = 0;
            branches.forEach(branch => {
                let a = trainingData.filter(data => data[clave] === branch).length;
                let p = trainingData.filter(data => data[clave] === branch && data[this.decision].toUpperCase() === "SI").length / a;
                let n = trainingData.filter(data => data[clave] === branch && data[this.decision].toUpperCase() === "NO").length / a;
                let r = a / trainingData.length;
                merito += (r *this.entropia(p, n));
            })
            meritos.push({name: clave, merito: merito, branches: branches});
        });
        return meritos;
    }
    
     entropia(p, n){
        return -p*this.fixedLog(p) - n*this.fixedLog(n);
    }
    
     fixedLog (number){
        return Math.log2(number) === -Infinity ? Number.MAX_SAFE_INTEGER : Math.log2(number)
    }
}



module.exports = {
    ID3: ID3
}