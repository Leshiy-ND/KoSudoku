var playingField     = "",
    selectedSquare   = 0,
    selectedTile     = 0,
    selectedCollumn  = 0,
    selectedRow      = 0,
    complexity       = 0,
    complexitySquare = 0;



function adjustFieldFontSize() {
    var field = document.getElementById("field");
    var candField = document.getElementById("cand-field");

    var orienter = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;
    var fieldRatio = 0.8;
    var fontRatio = 0.6;
    var newFontSize = orienter * fieldRatio * fontRatio / complexitySquare;

    field.style.fontSize = newFontSize + "px";
    candField.style.fontSize = newFontSize / complexity + "px";
}

function updateSelection() {
    document.querySelectorAll("[tile]").forEach(tileElem => {
        // if (tileElem.className == "tile-fixed") return;

        const tile   = parseInt( tileElem               .getAttribute("tile")   );
        const square = parseInt( tileElem.parentElement .getAttribute("square") );

        if (selectedSquare == square && selectedTile == tile) {
            tileElem.className = tileElem.className.includes("fixed") ? "tile-fixed-selected-full" : "tile-selected-full";
            return;
        }

        const collumn   =              (square - 1) % complexity  * complexity   +              (tile - 1) % complexity    +   1;
        const row       =   Math.floor((square - 1) / complexity) * complexity   +   Math.floor((tile - 1) / complexity)   +   1;

        if (selectedCollumn == collumn || selectedRow == row) {
            tileElem.className = tileElem.className.includes("fixed") ? "tile-fixed-selected-half" : "tile-selected-half";
            return;
        }

        tileElem.className = tileElem.className.includes("fixed") ? "tile-fixed" : "tile";
    });
}



function genNewField(_complexity) {
    selectedSquare   = 0;
    selectedTile     = 0;
    selectedCollumn  = 0;
    selectedRow      = 0;
    complexity       = _complexity;
    complexitySquare = complexity * complexity;

    var gridTemplate = "repeat(" + complexity + ", " + 100.0 / complexity + "%)";

    var field     = document.getElementById("field");
    field.innerHTML = "";
    field.style.gridTemplateColumns = gridTemplate;

    var candField = document.getElementById("cand-field");
    candField.innerHTML = "";
    candField.style.gridTemplateColumns = gridTemplate;

    adjustFieldFontSize();

    var evenComplexity = (complexity % 2 == 0);
    var even = evenComplexity;

    for (var s = 1; s <= complexitySquare; s++) {
        even = !even;
        if (evenComplexity && s % complexity == 1) even = !even;

        var square = document.createElement('div');
        square.className = even ? "square-even" : "square-noteven";
        square.setAttribute("square", s)
        square.style.gridTemplateColumns = gridTemplate;

        var candSquare = document.createElement('div');
        candSquare.setAttribute("cand-square", s);
        candSquare.style.gridTemplateColumns = gridTemplate;

        for (var t = 1; t <= complexitySquare; t++) {
            var tile = document.createElement('div');
            tile.className = ((s + t) % 5 == 0) ? "tile-fixed" : "tile";
            tile.setAttribute("tile", t);
            // tile.textContent = t;

            var candTile = document.createElement('div');
            candTile.setAttribute("cand-tile", t);
            candTile.style.gridTemplateColumns = gridTemplate;

            for (var c = 1; c <= complexitySquare; c++) {
                var candCand = document.createElement('div');
                candCand.setAttribute("cand-cand", c);
                if (c != 5) candCand.textContent = c;

                candTile.appendChild( candCand );
            }

                square.appendChild(     tile );
            candSquare.appendChild( candTile );
        }
            field.appendChild(     square );
        candField.appendChild( candSquare );
    }

    document.querySelectorAll("[tile]").forEach(tileElem => {
        tileElem.addEventListener("click", () => {
            const newTile   = parseInt( tileElem               .getAttribute("tile")   );
            const newSquare = parseInt( tileElem.parentElement .getAttribute("square") );

            if (selectedSquare == newSquare && selectedTile == newTile) return;

            selectedTile   = newTile;
            selectedSquare = newSquare;

            selectedCollumn   =              (selectedSquare - 1) % complexity  * complexity   +              (selectedTile - 1) % complexity    +   1;
            selectedRow       =   Math.floor((selectedSquare - 1) / complexity) * complexity   +   Math.floor((selectedTile - 1) / complexity)   +   1;

            console.log( "collumn:", selectedCollumn, ",   row:",  selectedRow, ",   square:", selectedSquare,  ",   tile:", selectedTile );
            updateSelection();
        });
    });
}



document.addEventListener('DOMContentLoaded', function() {

    document.getElementById("new-game-2").addEventListener("click", () => { genNewField(2) });
    document.getElementById("new-game-3").addEventListener("click", () => { genNewField(3) });
    document.getElementById("new-game-4").addEventListener("click", () => { genNewField(4) });

    document.getElementById("resize-nums").addEventListener("click", () => { adjustFieldFontSize() });
});