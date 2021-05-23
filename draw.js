function createMatrixFromArray(arr, is_center) {
    let matrix = document.createElement("table");
    
    if (is_center) matrix.classList.add("table-center");

    for (let i = 0; i < arr.length; i++) {
        let row = matrix.insertRow(i);
        for (let j = 0; j < arr[0].length; j++) {
            let col = row.insertCell(j);
            col.innerHTML = arr[i][j];
            col.classList.add("matrix");
        }
    }

    return matrix;
}

function createMatrixFromHex(arr, is_center) {
    let matrix = document.createElement("table");
    
    if (is_center) matrix.classList.add("table-center");

    if (arr.length === 8) {
        for (let i = 0; i < 8; i+= 2) {
            let row = matrix.insertRow(i / 2);
            let col = row.insertCell(0);
            col.innerHTML = arr[i] + arr[i + 1];
            col.classList.add("matrix");
        }
    }

    return matrix;
}

function generateNullMatrix() {
    let matrix = new Array(4);
    for (let i = 0; i < 4; i++) {
        matrix[i] = new Array(4);
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            matrix[i][j] = 0;
        }
    }

    return matrix;
}

function drawMatrix(parent, matrix) {
    let el = document.getElementById("" + parent);
    el.appendChild(matrix);
}

function drawMatrixToElement(el, matrix) {
    el.appendChild(matrix);
}

function addTable(parent) {
    let table = document.createElement("table");
    table.classList.add("table-center");
    document.getElementById("" + parent).appendChild(table);

    return table;
}

const timer = ms => new Promise(res => setTimeout(res, ms));

async function addRowWithTimer(table, arr, delay) {
    for (let i = 0; i < arr.length; i++) {
        let row = table.insertRow(i);
        for (let j = 0; j < arr[0].length; j++) {
            let col = row.insertCell(j);
            col.innerHTML = arr[i][j];
            col.classList.add("matrix");

            await timer(delay);
        }
    }
}

function drawText(parent, text) {
    let el = document.createElement("p");
    el.innerHTML = text;
    document.getElementById("" + parent).appendChild(el);

    return el;
}

function drawCenterText(parent, text) {
    let t = drawText(parent, text);
    t.style.textAlign = "center";

    return t;
}

function drawListText(parent, text) {
    let ul = document.createElement("ul");
    ul.style.marginTop = "30px";
    let el = document.createElement("li");
    el.style.listStyleType = "square";

    let t = document.createTextNode(text);
    el.appendChild(t);

    ul.appendChild(el);

    document.getElementById("" + parent).appendChild(ul);

    return el;
}

function drawcenterArray(parent, arr, arr_title) {
    let container = document.createElement("div");
    container.classList.add("step-center-container");

    let col = document.createElement("div");
    col.innerHTML = arr_title;
    col.classList.add("step-col");
    let matrix = createMatrixFromArray(arr, true);
    drawMatrixToElement(col, matrix);
    container.appendChild(col);

    document.getElementById("" + parent).appendChild(container);

    return matrix;
}

function drawcenterHex(parent, hex, hex_title) {
    let container = document.createElement("div");
    container.classList.add("step-center-container");

    let col = document.createElement("div");
    col.innerHTML = hex_title;
    col.classList.add("step-col");
    let matrix = createMatrixFromHex(hex, true);
    drawMatrixToElement(col, matrix);
    container.appendChild(col);

    document.getElementById("" + parent).appendChild(container);

    return matrix;
}

function textWithTwoColumns(parent, text_1, text_2) {
    let container = document.createElement("div");
    container.classList.add("step-twocol-container");

    let col = document.createElement("div");
    col.innerHTML = text_1;
    container.appendChild(col);

    let col2 = document.createElement("div");
    col2.innerHTML = text_2;
    container.appendChild(col2);

    document.getElementById("" + parent).appendChild(container);
}

function arrayWithTwoColumns(parent, arr1_title, arr2_title, arr1, arr2) {
    let container = document.createElement("div");
    container.classList.add("step-twocol-container");

    let col = document.createElement("div");
    col.innerHTML = arr1_title;
    col.classList.add("step-col");
    let matrix1 = createMatrixFromArray(arr1, true);
    drawMatrixToElement(col, matrix1);
    container.appendChild(col);

    let col2 = document.createElement("div");
    col2.innerHTML = arr2_title;
    col2.classList.add("step-col");
    let matrix2 = createMatrixFromArray(arr2, true);
    drawMatrixToElement(col2, matrix2);
    container.appendChild(col2);

    document.getElementById("" + parent).appendChild(container);
}

function arrayWithTwoColumnsXOR(parent, arr1_title, arr2_title, arr1, arr2) {
    let container = document.createElement("div");
    container.classList.add("step-threecol-container");

    let col = document.createElement("div");
    col.innerHTML = arr1_title;
    col.classList.add("step-col");
    let matrix1 = createMatrixFromArray(arr1, true);
    drawMatrixToElement(col, matrix1);
    container.appendChild(col);

    let col2 = document.createElement("div");
    col2.classList.add("step-col");
    col2.innerHTML = "XOR";
    container.appendChild(col2);

    let col3 = document.createElement("div");
    col3.innerHTML = arr2_title;
    col3.classList.add("step-col");
    let matrix2 = createMatrixFromArray(arr2, true);
    drawMatrixToElement(col3, matrix2);
    container.appendChild(col3);

    document.getElementById("" + parent).appendChild(container);
}

function arrayWithThreeColumns(parent, arr1_title, arr2_title, arr3_title, arr1, arr2, arr3) {
    let container = document.createElement("div");
    container.classList.add("step-threecol-container");

    let col = document.createElement("div");
    col.innerHTML = arr1_title;
    col.classList.add("step-col");
    let matrix1 = createMatrixFromArray(arr1, true);
    drawMatrixToElement(col, matrix1);
    container.appendChild(col);

    let col2 = document.createElement("div");
    col2.innerHTML = arr2_title;
    col2.classList.add("step-col");
    let matrix2 = createMatrixFromArray(arr2, true);
    drawMatrixToElement(col2, matrix2);
    container.appendChild(col2);

    let col3 = document.createElement("div");
    col3.innerHTML = arr3_title;
    col3.classList.add("step-col");
    let matrix3 = createMatrixFromArray(arr3, true);
    drawMatrixToElement(col3, matrix3);
    container.appendChild(col3);

    document.getElementById("" + parent).appendChild(container);
}

function newStep(step_str) {
    let el = document.createElement("div");
    let id = step_str.split(' ').join('');

    el.classList.add("step-card");
    el.setAttribute("id", id);

    document.getElementById("drawable").appendChild(el);

    let step_title = drawText(id, step_str);
    step_title.classList.add("step-title");

    return el;
}

function removeAllStep() {
    let all_step = document.getElementsByClassName("step-card");
    while (all_step.length > 0) {
        all_step[0].parentNode.removeChild(all_step[0]);
    }
}