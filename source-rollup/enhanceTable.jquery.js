import * as util from "./util.js";
import { createFieldChooser } from "./fieldChooser.js";

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {
"use strict";

// undefined is used here as the undefined global variable in ECMAScript 3 is
// mutable (ie. it can be changed by someone else). undefined isn't really being
// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
// can no longer be modified.

// window and document are passed through as local variables rather than global
// as this (slightly) quickens the resolution process and can be more efficiently
// minified (especially when both are regularly referenced in your plugin).

// Create the defaults once
var pluginName = "enhanceTable";
var defaults = {
sortable: true,
enableFieldChooser: true,
sortableHeaderRowClass: "sortable",
}; // defaults

// The actual plugin constructor
function Plugin ( element, options ) {
this.element = element;

// jQuery has an extend method which merges the contents of two or
// more objects, storing the result in the first object. The first object
// is generally empty as we don't want to alter the default options for
// future instances of the plugin
this.settings = $.extend( {}, defaults, options );
this._defaults = defaults;
this._name = pluginName;
this.init();
} // Plugin

// Avoid Plugin.prototype conflicts
$.extend( Plugin.prototype, {
init: function() {

// Place initialization logic here
// You already have access to the DOM element and
// the options via the instance, e.g. this.element
// and this.settings
// you can add more functions like the one below and
// call them like the example below

if (this.settings.sortable) this.makeSortable ();
if (this.settings.enableFieldChooser) this.makeFieldChooser ();
}, // init


makeSortable: function makeSortable () {
let table = this.element;
if (!isDomNode(table)) {
throw("makeSortable requires a DOM node as first argument");
return;
} // if

let headerRow = table.querySelector (`tr.${this.settings.sortableHeaderRowClass}`) || table.querySelector ("tr th").parentElement || null;
if (! headerRow) {
throw ("invalid table, must contain at least 1 'tr' element");
return;
} // if

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

rewriteData (table, data);
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

function isDomNode (x) {return HTMLElement && x instanceof HTMLElement;}
}, // makeSortable

makeFieldChooser: function () {
let _this = this;
let table = this.element;
let fieldNames = util.extractFieldNames (table);
let data = util.extractData (table);
let dataStore = util.createUnorderedDataStore (data, fieldNames);

let $fieldChooserLauncher = $(`<tr><td colspan="${fieldNames.length}"><button class="fieldChooser">Choose Fields</button></td></tr>`);
$("thead", table).prepend($fieldChooserLauncher);

$fieldChooserLauncher.on ("click", launchFieldChooser);

function launchFieldChooser () {
createFieldChooser(fieldNames, (newFieldNames) => {

if (newFieldNames) {
console.log ("new field names found -- refreshing table");
fieldNames = newFieldNames;
data = util.createOrderedData (dataStore, fieldNames);
$(table).empty ();
util.createTable (table, fieldNames, data);
$("thead", table).prepend($fieldChooserLauncher);
if (_this.settings.sortable) _this.makeSortable ();
$fieldChooserLauncher.on ("click", launchFieldChooser);
} // if

$(table).find ($fieldChooserLauncher).find("button").focus ();
}); // createFieldChooser
} // launchFieldChooser
} // makeFieldChooser

}); // extend prototype // makeSortable




// A really lightweight plugin wrapper around the constructor,
// preventing against multiple instantiations
$.fn[ pluginName ] = function( options ) {
return this.each( function() {
if ( !$.data( this, "plugin_" + pluginName ) ) {
$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
} // if
}); // each
}; // plugin wrapper

} )( jQuery, window, document );
