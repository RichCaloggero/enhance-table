let $ = require ("jQuery");
module.exports = createFieldChooser;
function createFieldChooser (fieldNames, activeFieldList, callback) {
let fieldList;
if (typeof(fieldNames) === "string" || fieldNames instanceof String)
fieldList = fieldNames.split(",").map(item => item.trim());
else fieldList = fieldNames; // assume it's an array

if (! activeFieldList) activeFieldList = [];

$fieldChooser = createDialog ();
$fieldChooser.appendTo (document.querySelector("body"));

let $available = $(".available", $fieldChooser);
let $active = $(".active", $fieldChooser);
let $cancel = $(".cancel", $fieldChooser);
let $reset = $(".reset", $fieldChooser);
let $apply = $(".apply", $fieldChooser);

$(".list", $available).append (createFields (fieldList));
initializeActiveFields (activeFieldList);
$cancel.focus ();



$reset.on ("click", () => {
activateAllFields ();
}); // reset

$cancel.on ("click", function () {
callback (getFieldNames(availableFields()));
$fieldChooser.remove ();
}); // cancel

$apply.on ("click", () => {
let names = getFieldNames(activeFields());
console.log ("applying with ", names);
if (names) {
callback (names);
$fieldChooser.remove();
} else {
alert ("Please activate at least one field, or cancel this operation.");
} // if
}); // apply

$available.on ("click", (e) => {
toggleActive ($(e.target));
return false;
}); // click on $available

$active.on ("click", (e) => {
// are any pressed
let $pressed = activeFields().has("[aria-pressed='true']");
if ($pressed.length === 0) {
$(e.target).attr("aria-pressed", "true");
setButtonStyle ($(e.target));
} else if ($pressed.length === 1) {
move ($pressed, $(e.target).closest(".field"));
$("button", $pressed).attr("aria-pressed", "false");
setButtonStyle ($("button", $pressed));
} // if
return;

function move ($from, $to) {
$from.insertBefore ($to);
} // move
}); // click on $active


function initializeActiveFields (list) {
if (! list) return activateAllFields ();

getFields().each (function () {
if (list.includes($(this).text())) {
activateField ($(this));
} // if
}); // each field in list
} // initializeActiveFields 



// keyboard shortcuts

$fieldChooser.on ("keyup", (e) => {
switch (e.key) {
case "Escape": return $cancel.trigger ("click");
case "Enter": return $apply.trigger ("click");
} // switch

return true;
}); // keyup

// helpers


function refreshActiveList () {
let $activeFieldList = $(".list", $active);

$activeFieldList.empty ().append (
createFields(
getFieldNames(availableFields().has("[aria-pressed='true']")),
) // createFields
); // append
} // refreshActiveList

function activeFields () {
return getFields ($active);
} // getActiveFields

function availableFields () {
return getFields ($available);
} // getAvailableFields

function getFields ($pane) {
let result = ($pane? $pane : $available).find (".list .field");
console.log ("getFields: ", result);
return result;
} // getFields

function getFieldNames ($fields) {
let result = $fields.get().map ((element) => element.textContent);
console.log ("fieldnames: ", result);
return result;
} // getFieldNames


function activateAllFields () {
availableFields().each (function () {
activateField ($(this));
}); // each
} // activateAllFields

function activateField ($field) {
$("button", $field).attr ("aria-pressed", "true");
setButtonStyle ($("button", $field));
$(".list", $active).append (createField($field.text()));
} // activateField

function createFields (names) {
return names.map (name => createField(name));
} // createFields

function createField (name) {
return $(`<li class="field"><button aria-pressed="false">${name}</button></li>`);
} // createField

function deactivateField ($field) {
$("button", $field).attr ("aria-pressed", "false");
setButtonStyle ($("button", $field));
$(`.list .field:contains(${name})`, $active).remove();
} // deactivateField

function toggleActive ($button) {
togglePressed ($button);
refreshActiveList ();
} // toggleActive

function setButtonStyle ($button) {
if (! $button.is ("[aria-pressed]")) {
console.log ("button ", $button.text(), " not toggle button");
$button.css ({border: "none", "box-shadow": "unset"});
} else {
console.log ("button ", $button.text(), " is a toggle button");
$button.css ({border: "thin solid gold"});
if ($button.is ("[aria-pressed='true']")) {
$button.css ("box-shadow", "inset 5em 1em gold");
} else {
$button.css ("box-shadow", "unset");
} // if
} // if
} // setButtonStyle


function togglePressed ($button) {
$button.attr ("aria-pressed",
$button.attr("aria-pressed") === "true"? "false" : "true"
);
setButtonStyle ($button);
} // togglePressed

function clearPressed ($buttons) {
$buttons.attr ("aria-pressed", "false");
} // clearPressed


function getChecked ($list) {
return $list.find("input").get().filter (x => x.checked).map (item => item.value);
} // getChecked

function getPressed ($list, indexes) {
return $list.find("button[aria-pressed='true']").get()
.map ((item, index) => indexes? index : item.textContent);
} // getPressed

function createDialog () {
return $(`
<div class="fieldChooser" role="dialog" aria-labelledby="fieldChooser-title" aria-describedby="fieldChooser-instructions">
<div class="head">
<h2 id="fieldChooser-title">Field Chooser</h2>
<button class="cancel">Cancel</button>
</div>

<div class="body">
<div id="fieldChooser-instructions">
To add a field to the active list, click it's name in the available fields list.
To remove it from the active list, click it's name again in the availabel list.
</p><p>
To change order of fields:
</p><ol><li>
click the field name you want to reposition in the active list
</li><li>
click another active field to move it <em>before</em> that one
</li></ol>
</div>

<div class="available" role="region" aria-label="Available Fields">
<button class="reset">Reset</button>
<ul class="fields list"></ul>
</div>

<div class="active" role="region" aria-label="Active Fields">
<ul class="fields list"></ul>
</div>

<button class="apply">Apply</button>
</div><!-- .body -->
</div><!-- .fieldChooser -->
`); // dialog
} // createDialog


} // createFieldChooser

