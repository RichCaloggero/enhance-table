function createFieldChooser (fieldNames, callback) {
let fieldList;
if (typeof(fieldNames) === "string" || fieldNames instanceof String)
fieldList = fieldNames.split(",").map(item => item.trim());
else fieldList = fieldNames; // assume it's an array

let $fieldChooser = $(`
<div class="fieldChooser" role="dialog" aria-labelledby="fieldChooser-title" aria-describedby="fieldChooser-instructions">
<div class="head">
<h2 id="fieldChooser-title">Field Chooser</h2>
<button class="close" aria-label="close">X</button>
</div>

<div class="body">
<p id="fieldChooser-instructions">
</p>

<div class="available">
<button class="clear">Clear</button>
<ul class="fields list"></ul>
</div>

<div class="active">
<ul class="fields list"></ul>
</div>

<button class="apply">Apply</button>
</div><!-- .body -->
</div><!-- .fieldChooser -->
`); // dialog
$fieldChooser.appendTo (document.querySelector("body"));
$(".close", $fieldChooser).focus ();

let $available = $(".available", $fieldChooser);
let $active = $(".active", $fieldChooser);

$(".close", $fieldChooser).on ("click", () => {
callback("")
$fieldChooser.remove ();
}); // close / cancel

$(".list", $available).append (createListItems (fieldList, '<button aria-pressed="false"></button>'));

$available.on ("click", (e) => {
let $activeFields = $(".list", $active);
let $field = $(e.target);
togglePressed ($field);

$activeFields.empty ()
.append (createListItems (
$(".list [aria-pressed='true']", $available).map((i,x) => x.textContent).get(),
'<button></button>')); // append
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

$(".apply", $fieldChooser).on ("click", () => {
callback ($(".list button", $active).map ((i, x) => x.textContent).get());
$fieldChooser.remove();
}); // apply

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

