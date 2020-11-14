require("dotenv").config();
let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");
// let methodOverride = require("method-override");
// let morgan = require("morgan");
let exphbs = require("express-handlebars");
let multer = require("multer");
// let session  = require("express-session");
let routes = require("./routes");


module.exports = function(app) {
    const IN_PROD = process.env.NODE_ENV === "production";
    const SESS_TIME = 1000 * 60 *60 * 3;
    // app.use(morgan("dev"));
    app.use(bodyParser.urlencoded({"extended": false}));
    app.use(bodyParser.json());
    // app.use(methodOverride());
    app.use("/public", express.static(path.resolve(__dirname, "../static")));
    app.use("/upload", express.static(path.resolve(__dirname, "../static")));
    // app.use(session({
    //     name: process.env.SESS_NAME,
    //     resave: false,
    //     saveUninitialized: false,
    //     secret: process.env.SESS_SECRET,
    //     cookie: {
    //         // path: "/profile",
    //         maxAge: SESS_TIME,
    //         secure: IN_PROD,
    //         sameSite: true
    //     }
    // }));
    routes(app);
    app.engine("hbs", exphbs({
        defaultLayout: "main",
        extname: ".hbs",
        layoutsDir: path.resolve(__dirname, "../views") + "/layouts",
        partialsDir: app.get("views") + "/partials",
        runtimeOptions: {
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true
        }
    }));
    app.set("view engine", "hbs");

    return app;
    // app.get("views")
}