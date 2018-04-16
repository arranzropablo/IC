var path = require("path");
var fs = require('fs');

module.exports = {

    readAndParseToArray: function (fileName){
        let content;
        try{
            content = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8');
        } catch (err) {
            console.log("Error leyendo el archivo " + fileName);
            return [];
        }
        //reemplaza saltos de linea por "," y quita las posiciones vacias
        return content.replace(/(\r\n)/g,",").split(",").filter(data => data !== "");
    },
    
    transformNodesToPrintable: function (tree, printable){
        //No estoy seguro de si esto funcionará para pintar otros arboles
        if (tree.data.name === "+" || tree.data.name === "-" || tree.data.name === "no data") {
            printable.push([tree.data.comingFrom, tree.data.name.toUpperCase()]);
        } else if (tree.childIdsList.every(childkey => tree.childs[childkey].data.name === "+" || tree.childs[childkey].data.name === "-" || tree.childs[childkey].data.name === "no data")) {
            let branch = []
            branch.push(tree.data.comingFrom);
            let leaf = [];
            leaf.push(tree.data.name.toUpperCase());
            tree.childIdsList.forEach(childkey => leaf.push([tree.childs[childkey].data.comingFrom, tree.childs[childkey].data.name.toUpperCase()]));
            branch.push(leaf);
            printable.push(branch);
    
        } else {
            tree.childIdsList.forEach(childkey => {
                this.transformNodesToPrintable(tree.childs[childkey],printable)
            });
        }
    },

    parseArrayToTrainingData: function (atributos, data){
        let trainingData = [];
        for (let i = 0; i < data.length - atributos.length + 1; i++){
            let trainingItem = {};
            for (let j = 0; j < atributos.length; j++){
                trainingItem[atributos[j]] = data[i];
                i++;
            }
            i--;
            trainingData.push(trainingItem);
        }
        return trainingData;
    },

    guessResult: function (atributos, arbol){
        atributos = atributos.map(atrib => atrib.toUpperCase());
        for(branch in arbol.data.branches){
            if(atributos.indexOf(arbol.data.branches[branch].toUpperCase()) !== -1){
                let childid = arbol.childIdsList.filter(id => arbol.childs[id].data.comingFrom.toUpperCase() === arbol.data.branches[branch].toUpperCase());
                if(arbol.childs[childid].data.name === "+" || arbol.childs[childid].data.name === "-" || arbol.childs[childid].data.name === "no data"){
                    return arbol.childs[childid].data.name;
                } else {
                    atributos.splice(atributos.indexOf(arbol.data.branches[branch].toUpperCase()), 1);
                    return this.guessResult(atributos, arbol.childs[childid])
                }
            }
        }
    }

}

