util = require ("./util.js");

// given table DOM node, makes that table sortable
module.exports = makeTableSortable ;
function makeTableSortable  (table, headerRow) {
addSortControls (table, headerRow);
headerRow.addEventListener ("click", clickHandler);
return table;

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

function addSortControls (table, headerRow) {
Array.from(headerRow.querySelectorAll ("th"))
.map (cell => {
cell.innerHTML = `<button>${cell.textContent}</button>`;
cell.setAttribute ("aria-sort", "");
});
} // addSortControls


function sortTable (table, sortBy, direction) {
let data = util.extractData (table);

let compare = (direction === "ascending")? compareAscending : compareDescending;
data.sort ((a, b) => compare(a[sortBy], b[sortBy]));

util.rewriteData (table, data);
return data;
} // sortTable



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
} // makeTableSortable 
