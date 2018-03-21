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
}

}

