import * as util from "./util.js";

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
