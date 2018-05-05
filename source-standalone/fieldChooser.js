function createFieldChooser (fieldNames, callback) {
let fieldList;
if (typeof(fieldNames) === "string" || fieldNames instanceof String)
fieldList = fieldNames.split(",").map(item => item.trim());
else fieldList = fieldNames; // assume it's an array

let $fieldChooser = $(`
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

$fieldChooser.appendTo (document.querySelector("body"));

let $available = $(".available", $fieldChooser);
let $active = $(".active", $fieldChooser);
let $cancel = $(".cancel", $fieldChooser);
let $reset = $(".reset", $fieldChooser);
let $apply = $(".apply", $fieldChooser);

$(".list", $available).append (createListItems (fieldList, '<button aria-pressed="false"></button>'));
activateAllFields ();
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
let $pressed = $(".list [aria-pressed='true']", $active);
if ($pressed.length === 0) {
$(e.target).attr("aria-pressed", "true");
} else if ($pressed.length === 1) {
move ($pressed, $(e.target));
$pressed.removeAttr ("aria-pressed");
} // if
return;

function move ($from, $to) {
$from.insertBefore ($to);
} // move
}); // click on $active


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
createListItems (
getFieldNames(availableFields().has("[aria-pressed='true']")),
'<button></button>'
) // createListItems
); // append
} // refreshActiveList

function activeFields () {
return getFields ($active);
} // getActiveFields

function availableFields () {
return getFields ($available);
} // getAvailableFields

function getFields ($pane) {
return $pane.find (".list li");
} // getFields

function getFieldNames ($fields) {
return $fields.map ((i, element) => $(element).text()).get();
} // getFieldNames

function toggleActive ($button) {
togglePressed ($button);
if ($button.is ("[aria-pressed='true']")) {
$button.css ("box-shadow", "inset 5em 1em gold");
} else {
$button.css ("box-shadow", "unset");
} // if
refreshActiveList ();
} // toggleActive

function activateField ($field) {
$("[aria-pressed]", $field).attr ("aria-pressed", "true");
refreshActiveList ();
} // activateField

function deactivateField ($field) {
$field.attr ("aria-pressed", "false");
refreshActiveList ();
} // deactivateField

function activateAllFields () {
availableFields().each (function () {
activateField ($(this));
}); // each available field
} // activateAllFields




function togglePressed ($button) {
$button.attr ("aria-pressed",
$button.attr("aria-pressed") === "true"? "false" : "true"
);
} // togglePressed

function clearPressed ($buttons) {
$buttons.attr ("aria-pressed", "false");
} // clearPressed

function createListItems (list, html, type) {
return list.map (item => $(`<li>${item}</li>`).wrapInner (html));
} // createListItems

function getChecked ($list) {
return $list.find("input").get().filter (x => x.checked).map (item => item.value);
} // getChecked

function getPressed ($list, indexes) {
return $list.find("button[aria-pressed='true']").get()
.map ((item, index) => indexes? index : item.textContent);
} // getPressed
} // createFieldChooser

