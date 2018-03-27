## Sortable tables

This function creates accessible sortable tables.

Tag the row you wish to use as sort triggers with class "sort".

Call makeSortable with a string representing a selector, or with dom node(s), or any combination thereof.

_Note: there is no removal of duplicates from the set of elements dirrived from the arguments passed to makeSortable ().

## Example

- makeSortable ("table"); // makes all tables in the document sortable
- makeSortable ("table.sortable"); // makes sortable all tables with class "sortable"
- makeSortable (t); // make the dom node `t` sortable
