let express = require("express");
let config = require("./config");
let expressapp = express();
let app = config(expressapp);
let path = require("path");
let db = require("./database");
let connectDB = db.connectDB;

// app.set("port", process.env.PORT || 8080);
app.set("views", path.resolve(__dirname, "../views"));
// console.log(app.get("views") + "\\layouts");

module.exports = expressapp;