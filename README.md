## Enhanced tables

This is a jQuery plugin that enhances tables in the following ways:

- makes them sortable
	+ option "sortable" can be set to false to suppress sorting
	+ tag the row you wish to contain sort controls with class "sortable", otherwise first `tr` inside `thead` is used
	+ option "sortableHeaderRowClass" can be set to the class name of row which contains column headers to sort by
- adds a field chooser button to top of table
	+ option "enablefieldChooser" can be set to false to suppress

The field chooser:

- allows removing fields (columns) you don't want to see
- reordering active fields

All operations are keyboard accessible. To reorder:

- click, or press enter on,  a field name from the active list to indicate which field you wish to move
- click, or press enter on, the name in the active list where you want to move to
	+ field is inserted _before_ the item
- click the "apply" button
	+ click "cancel" to keep previous configuration

Call like this:

```
<script src="jquery.min.js"></script>
<script src="enhanceTable.jquery.min.js"></script>

<script>
$("table").enhanceTable();
</script>
```

