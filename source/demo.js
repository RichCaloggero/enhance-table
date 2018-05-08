let enhanceTable  = require ("./enhanceTable.jquery.js");
let util = require ("./util.js");
let fields = ["musician", "instrument", "genre"];
let data = [
["Jerry Garcia", "guitar", "rock"],
["Elton John", "piano", "rock"],
["Elvin Jones", "drums", "jazz"],
["Yoyo Mah", "cello", "classical"],
["Rich Caloggero", "guitar", "jam"]
];

util.createTable ("#musicians", fields, data);
$("table").enhanceTable();
