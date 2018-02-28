$(function(){
    var action
    var selectedCell

    $(".resize").on("click", function(){
        let numcolumns = ($($("tr")[0]).children("td").length)
        let numrows = $("tr").length
        switch ($(this).attr("id")){
            case "addrow":
                let newRow = $("<tr>")
                for(let i = 0; i < numcolumns; i++){
                    newRow.append($("<td>"))
                }
                $($("tr")[$("tr").length - 1]).after(newRow)
                break
            case "deleterow":
                if(numrows > 2){
                    $($("tr")[$("tr").length - 1]).remove()
                }
                break
            case "addcolumn":
                for(let i = 0; i < numrows; i++){
                    $($("tr")[i]).append($("<td>"))
                }
                break
            case "deletecolumn":
                if(numcolumns > 2){
                    for(let i = 0; i < numrows; i++){
                        $($("tr")[i]).children().last().remove()
                    }
                }
                break
            case "decreaseheight":
                if (selectedCell !== undefined && selectedCell.attr("data-height") !== undefined && Number(selectedCell.attr("data-height")) > 0){
                    selectedCell.attr("data-height", Number(selectedCell.attr("data-height")) - 1)
                    if (Number(selectedCell.attr("data-height")) === 0){
                        selectedCell.css({'text-align': 'center'})
                        selectedCell.html("")
                    } else {
                        selectedCell.css({'text-align': 'center'})
                        selectedCell.html('<img src="images/mountain_' + selectedCell.attr("data-height") + '.svg" id="mountain" height="50" width="50">')
                    }
               }
                break
            case "increaseheight":
                if (selectedCell !== undefined && (selectedCell.attr("data-height") === undefined || Number(selectedCell.attr("data-height")) < 3)) {
                    if (selectedCell.attr("data-height") !== undefined){
                        selectedCell.attr("data-height", Number(selectedCell.attr("data-height")) + 1)
                    } else {
                        selectedCell.attr("data-height", 1)
                    }
                    selectedCell.css({'text-align': 'center'})
                    selectedCell.html('<img src="images/mountain_' + selectedCell.attr("data-height") + '.svg" id="mountain" height="50" width="50">')
                }
                break
        }
    })

    $("#obstaclebutton").on("click", function(){
        if (action === "obstacle"){
            action = undefined
        } else {
            action="obstacle"
            selectedCell = undefined
        }
    })

    $("#startbutton").on("click", function(){
        if (action === "start"){
            action = undefined
        } else {
            action="start"
            selectedCell = undefined

        }
    })

    $("#endbutton").on("click", function(){
        if (action === "end"){
            action = undefined
        } else {
            action="end"
            selectedCell = undefined
        }
    })

    $(document).on("click", "td", function(){
        $(".arrow").remove()
        switch(action){
            case "obstacle":
                if($(this).find("#obstacle").length > 0){
                    $(this).html('')
                } else {
                    $(this).css({'text-align': 'center'})
                    $(this).html('<img src="images/obstacle.svg" id="obstacle" height="50" width="50">')
                }
                break
            case "start":
                if($("#start").length > 0){
                    $("#start").remove()
                }
                $(this).css({'text-align': 'center'})
                $(this).html('<img src="images/start.svg" id="start" height="50" width="50">')
                break
            case "end":
                if($("#end").length > 0){
                    $("#end").remove()
                }
                $(this).css({'text-align': 'center'})
                $(this).html('<img src="images/end.svg" id="end" height="50" width="50">')
                break
        }
    })

    $(document).on("dblclick", "td", function(){
        if($(this).find("img").length === 0 || $($(this).find("img")).attr("id") === "mountain"){
            selectedCell = $(this)
        } else {
            selectedCell = undefined
        }
    })

    $("#findRoutebutton").on("click", function(){
        //Comprobamos que haya inicio y fin
        $(".arrow").remove()
        let casillaInicial
        let casillaFinal
        let matriz = createMatrix()
        for (row in matriz) {
            if (matriz[row].indexOf("start") !== -1) {
                casillaInicial = {
                    row: Number(row),
                    column: matriz[row].indexOf("start")
                }
            }
            if (matriz[row].indexOf("end") !== -1) {
                casillaFinal = {
                    row: Number(row),
                    column: matriz[row].indexOf("end")
                }
            }
        }

        if (casillaInicial !== undefined && casillaFinal !== undefined){
            encontrarCamino(matriz, casillaInicial, casillaFinal)
            let path = []
            getPath(matriz, casillaFinal, path, casillaInicial)
            path.reverse()
            if(path.length === 0){
                alert("No hay camino posible.")
            }
            else {
                for (let i = 1; i < path.length - 1; i++){
                    pintarDireccion(matriz, path[i], path[i + 1])
                }
            }
        }
        else{
            alert("Debes seleccionar un inicio y un final")
        }
    })

})

function encontrarCamino(matriz, casillaInicial, casillaFinal){
    //casilla inicial
    //Creo q lo de estado no hace falta guardarlo porque solo se van a transformar aquellas q son libres
    matriz[casillaInicial.row][casillaInicial.column] = {
        estado: matriz[casillaInicial.row][casillaInicial.column],
        dEstimada: Math.sqrt(Math.pow(casillaInicial.row - casillaFinal.row,2) + Math.pow(casillaInicial.column - casillaFinal.column,2)),
        dAcumulada: 0,
        apuntando: null
    }
    let abierta = []
    let cerrada = []
    abierta[0] = casillaInicial
    while (abierta.length > 0){
        let casilla = abierta.shift()
        cerrada.push(casilla)
        if (cerrada.some(cell => cell.row === casillaFinal.row && cell.column === casillaFinal.column)){
            break
        }
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
                if(isInMatrix(casilla.row + i, casilla.column + j) &&
                    !isInList(casilla.row + i, casilla.column + j, abierta) &&
                    !isInList(casilla.row + i, casilla.column + j, cerrada) &&
                    !(i === 0 && j === 0) &&
                    matriz[casilla.row + i][casilla.column + j] !== "obstacle"){
                    penalizacionAltura = $($($("tr")[casilla.row + i]).children("td")[casilla.column + j]).attr("data-height") === undefined ? 0 : Number($($($("tr")[casilla.row + i]).children("td")[casilla.column + j]).attr("data-height"))
                    matriz[casilla.row + i][casilla.column + j] = {
                        estado: matriz[casilla.row + i][casilla.column + j],
                        dEstimada: Math.sqrt(Math.pow((casilla.row + i) - casillaFinal.row,2) + Math.pow((casilla.column + j) - casillaFinal.column,2)),
                        dAcumulada: matriz[casilla.row][casilla.column].dAcumulada + Math.hypot(casilla.row - (casilla.row + i), casilla.column - (casilla.column + j)) + penalizacionAltura,
                        apuntando: casilla
                    }
                    abierta.push({row: casilla.row + i, column: casilla.column + j})
                    abierta.sort((a, b) => {
                        return (matriz[a.row][a.column].dEstimada + matriz[a.row][a.column].dAcumulada) - (matriz[b.row][b.column].dEstimada + matriz[b.row][b.column].dAcumulada)
                    })
                } else if (isInList(casilla.row + i, casilla.column + j, abierta) || isInList(casilla.row + i, casilla.column + j, cerrada)){
                    //comprueba distancias acumuladas y reordena si la nueva es mas optima
                    penalizacionAltura = $($($("tr")[casilla.row + i]).children("td")[casilla.column + j]).attr("data-height") === undefined ? 0 : Number($($($("tr")[casilla.row + i]).children("td")[casilla.column + j]).attr("data-height"))
                    if ((matriz[casilla.row + i])[casilla.column + j].dAcumulada > matriz[casilla.row][casilla.column].dAcumulada + Math.hypot(casilla.row - (casilla.row + i), casilla.column - (casilla.column + j)) + penalizacionAltura){
                        matriz[casilla.row + i][casilla.column + j].dAcumulada = matriz[casilla.row][casilla.column].dAcumulada + Math.hypot(casilla.row - (casilla.row + i), casilla.column - (casilla.column + j)) + penalizacionAltura
                        matriz[casilla.row + i][casilla.column + j].apuntando = casilla
                        updateNodosDependientes(matriz, abierta, cerrada, {row: casilla.row + i, column: casilla.column + j})
                        abierta.sort((a, b) => {
                            return (matriz[a.row][a.column].dEstimada + matriz[a.row][a.column].dAcumulada) - (matriz[b.row][b.column].dEstimada + matriz[b.row][b.column].dAcumulada)
                        })
                    }
                }
            }
        }
    }
}

function getPath(matriz, casilla, path, casillaInicial){
    if(matriz[casilla.row][casilla.column].apuntando !== undefined && matriz[casilla.row][casilla.column].apuntando !== null) {
        path.push(casilla)
        getPath(matriz, matriz[casilla.row][casilla.column].apuntando, path, casillaInicial)
    } else if (casilla === casillaInicial){
        path.push(casilla)
    }
}

//hacer qe se pinte desde la segunda a la penultima pa k se vean las badneras
function pintarDireccion(matriz, casilla, casillaSiguiente){
    if (casilla.row - casillaSiguiente.row === -1){
        if (casilla.column - casillaSiguiente.column === -1){
            $($($("tr")[casilla.row]).children("td")[casilla.column]).css({'text-align': 'center'})
            $($($("tr")[casilla.row]).children("td")[casilla.column]).html('<img src="images/Arrow_se.svg" class="arrow" height="50" width="50">')
        } else if (casilla.column - casillaSiguiente.column === 0){
            $($($("tr")[casilla.row]).children("td")[casilla.column]).css({'text-align': 'center'})
            $($($("tr")[casilla.row]).children("td")[casilla.column]).html('<img src="images/Arrow_s.svg" class="arrow" height="50" width="50">')
        } else if (casilla.column - casillaSiguiente.column === 1){
            $($($("tr")[casilla.row]).children("td")[casilla.column]).css({'text-align': 'center'})
            $($($("tr")[casilla.row]).children("td")[casilla.column]).html('<img src="images/Arrow_sw.svg" class="arrow" height="50" width="50">')
        }
    } else if (casilla.row - casillaSiguiente.row === 0){
        if (casilla.column - casillaSiguiente.column === -1){
            $($($("tr")[casilla.row]).children("td")[casilla.column]).css({'text-align': 'center'})
            $($($("tr")[casilla.row]).children("td")[casilla.column]).html('<img src="images/Arrow_e.svg" class="arrow" height="50" width="50">')
        }
        if (casilla.column - casillaSiguiente.column === 1){
            $($($("tr")[casilla.row]).children("td")[casilla.column]).css({'text-align': 'center'})
            $($($("tr")[casilla.row]).children("td")[casilla.column]).html('<img src="images/Arrow_w.svg" class="arrow" height="50" width="50">')
        }
    } else if (casilla.row - casillaSiguiente.row === 1){
        if (casilla.column - casillaSiguiente.column === -1){
            $($($("tr")[casilla.row]).children("td")[casilla.column]).css({'text-align': 'center'})
            $($($("tr")[casilla.row]).children("td")[casilla.column]).html('<img src="images/Arrow_ne.svg" class="arrow" height="50" width="50">')
        } else if (casilla.column - casillaSiguiente.column === 0){
            $($($("tr")[casilla.row]).children("td")[casilla.column]).css({'text-align': 'center'})
            $($($("tr")[casilla.row]).children("td")[casilla.column]).html('<img src="images/Arrow_n.svg" class="arrow" height="50" width="50">')
        } else if (casilla.column - casillaSiguiente.column === 1){
            $($($("tr")[casilla.row]).children("td")[casilla.column]).css({'text-align': 'center'})
            $($($("tr")[casilla.row]).children("td")[casilla.column]).html('<img src="images/Arrow_nw.svg" class="arrow" height="50" width="50">')
        }
    }
}

function updateNodosDependientes(matriz, abierta, cerrada, casilla){
    let updateThis = abierta.filter(cell => matriz[cell.row][cell.column].apuntando === casilla)
    updateThis.concat(cerrada.filter(cell => matriz[cell.row][cell.column].apuntando === casilla))
    updateThis.forEach(cell =>{
        if (matriz[cell.row][cell.column].dAcumulada > matriz[casilla.row][casilla.column].dAcumulada + Math.hypot(casilla.row - cell.row, casilla.column - cell.column)){
            matriz[cell.row][cell.column].dAcumulada = matriz[casilla.row][casilla.column].dAcumulada + Math.hypot(casilla.row - cell.row, casilla.column - cell.column)
            updateNodosDependientes(matriz, abierta, cerrada, cell)
        }
    })
}

function isInMatrix(row, column){
    let numcolumns = ($($("tr")[0]).children("td").length)
    let numrows = $("tr").length
    return row >= 0 && row < numrows && column >= 0 && column < numcolumns
}

function isInList(row, column, list){
    return list.some(casilla => casilla.row === row && casilla.column === column)
}

function createMatrix(){

    let numcolumns = ($($("tr")[0]).children("td").length)
    let numrows = $("tr").length
    let matriz = []
    for(let i = 0; i < numrows; i++){
        matriz[i] = []
        for(let j = 0; j < numcolumns; j++){
            if ($($($($("tr")[i]).children("td")[j]).children("img")[0]).attr("id") === "start"){
                matriz[i][j] = "start"
            } else if ($($($($("tr")[i]).children("td")[j]).children("img")[0]).attr("id") === "end"){
                matriz[i][j] = "end"
            } else if ($($($($("tr")[i]).children("td")[j]).children("img")[0]).attr("id") === "obstacle"){
                matriz[i][j] = "obstacle"
            } else {
                matriz[i][j] = "libre"
            }
        }
    }
    return matriz
}