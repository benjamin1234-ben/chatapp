let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let db = require("../server/database");
let bcrypt = require("bcrypt");
let UserModel = db.userModel;


let component = {
    view(req, res) {
        res.render("login");
    },
    access(req, res) {
        let body = req.body;
        UserModel.findOne({
            username: body.username
        }).then(async (doc) => {
            // console.log(doc);
            try {
                let passwordCheck = await bcrypt.compare(body.password, doc.password);
                if(passwordCheck) {
                    // jwt Authorization
                    let authUser = {username: body.username};
                    let accessToken = jwt.sign(authUser, process.env.ACCESS_TOKEN);
                    res.json({accessToken: accessToken});
                }
                else {
                    res.sendStatus(401);
                }
            } catch (err) {
                console.log(err);
            }
        }).catch(err => console.log(err));
    }
}

module.exports = component;