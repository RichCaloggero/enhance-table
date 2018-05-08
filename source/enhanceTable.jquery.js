"use strict";

//let jQuery = require ("jQuery");
let util = require ("./util.js");
let createFieldChooser = require ("./fieldChooser.js");
let makeTableSortable  = require ("./makeTableSortable.js");


(function enhanceTable ($ = global.jQuery) {
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
if (! util.isDomNode(table)) {
throw("makeSortable requires a DOM node as first argument");
return;
} // if

let headerRow = table.querySelector (`tr.${this.settings.sortableHeaderRowClass}`) || table.querySelector ("tr th").parentElement || null;
if (! headerRow) {
throw ("invalid table, must contain at least 1 'tr' element");
return;
} // if

return makeTableSortable (table, headerRow);
}, // makeSortable

makeFieldChooser: function () {
let _this = this;
let table = this.element;
let allFieldNames = util.extractFieldNames (table);
let initialDataStore = util.createUnorderedDataStore (util.extractData (table), allFieldNames);
let activeFieldNames = allFieldNames.slice();

let $fieldChooserLauncher = $(`<tr><td colspan="${allFieldNames.length}"><button class="fieldChooser">Choose Fields</button></td></tr>`);
$("thead", table).prepend($fieldChooserLauncher);

$fieldChooserLauncher.on ("click", launchFieldChooser);

function launchFieldChooser () {
createFieldChooser(allFieldNames, activeFieldNames, (newFieldNames) => {

if (newFieldNames) {
//console.log ("new field names found -- refreshing table");
activeFieldNames = newFieldNames;
let data = util.createOrderedData (initialDataStore, activeFieldNames);
$(table).empty ();
util.createTable (table, activeFieldNames, data);
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
})(); // enhanceTable // module

