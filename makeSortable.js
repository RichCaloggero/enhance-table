
function makeSortable (...tables) {
tables = getElements (tables);

tables.forEach (table => {
let headerRow = table.querySelector ("tr.sort") || table.querySelector ("tr");
if (! headerRow) {
alert ("invalid table, must contain at least 1 'tr' element");
return;
} // if

addSortControls (table, headerRow);
headerRow.addEventListener ("click", clickHandler);


function clickHandler (e) {
let cell = e.target.parentElement;
if (! cell.tagName.toLowerCase() === "th") return;

let direction = cell.getAttribute ("aria-sort");

if (direction) {
direction = (direction === "ascending")? "descending" : "ascending";
} else {
clearSortIndicators (headerRow);
direction = "ascending";
} // if

cell.setAttribute ("aria-sort", direction);
sortTable (table, columnIndex(cell), direction);
return;

function clearSortIndicators (headerRow) {
Array.from(headerRow.querySelectorAll ("[aria-sort]"))
.forEach (cell => cell.setAttribute ("aria-sort", ""));
} // clearSortIndicators
} // click handler
}); // forEach tables

function addSortControls (table, headerRow) {
Array.from(headerRow.querySelectorAll ("th"))
.map (cell => {
cell.innerHTML = `<button>${cell.textContent}</button>`;
cell.setAttribute ("aria-sort", "");
});
} // addSortControls


function sortTable (table, sortBy, direction) {
data = extractData (table);

let compare = (direction === "ascending")? compareAscending : compareDescending;
data.sort ((a, b) => compare(a[sortBy], b[sortBy]));

rewriteData (table, data);
return data;
} // sortTable


function extractData (table) {
return Array.from(table.querySelectorAll ("tbody tr"))
.map (tr => Array.from (tr.querySelectorAll ("td, th"))
.map (cell => cell.textContent) // map over cells in row
); // map over rows
} // extractData

function rewriteData (table, data) {
Array.from(table.querySelectorAll ("tbody tr"))
.map ((tr, r) => Array.from (tr.querySelectorAll ("td, th"))
.map ((cell, c) => cell.textContent = data[r][c]) // map over cells in row
); // map over rows
} // rewriteData

function columnIndex (cell) {
return Array.from(cell.parentElement.children).indexOf(cell);
} // columnIndex

function compareAscending (a, b) {
a = Number(a) || a;
b = Number(b) || b;

if (a < b) return -1;
else if (a > b) return 1;
else return 0;
} // compareAscending

function compareDescending (a, b) {
a = Number(a) || a;
b = Number(b) || b;

if (a < b) return 1;
else if (a > b) return -1;
else return 0;
} // compareDescending


function getElements (args) {
return args.reduce ((elements, arg) => elements = elements.concat (process(arg)), []);

function process (arg) {
if (isString(arg)) return Array.from(document.querySelectorAll(arg));
else if (isDomNode (arg)) return arg;
else return [];
} // process

function isString (x) {
return typeof(x) === "string"
|| x instanceof String;
} // isString

function isDomNode (x) {return HTMLElement && x instanceof HTMLElement;}
} // getElements
} // makeSortable
