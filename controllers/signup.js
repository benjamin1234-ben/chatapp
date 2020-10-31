let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");
let db = require("../server/database");
let bcrypt = require("bcrypt");
let UserModel = db.userModel;

let component = {
    view(req, res) {
        res.render("signup");
    },
    async register(req, res) {
        // console.log(req.body);
        try {
            let body = req.body;
            //Encrypt Password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            //Save User to Database
            let newUser = new UserModel({
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email,
                phonenumber: body.phonenumber,
                username: body.username,
                profilePic: body.filepath,
                password: hashedPassword
            }).save().then(doc => {
                // console.log(doc);
                // jwt Authorization
                // let authUser = {username: body.username};
                // let accessToken = jwt.sign(authUser, process.env.ACCESS_TOKEN);
                // res.json({accessToken: accessToken});
                res.redirect("/login");
            }).catch(err => console.log(err));
        } catch (err) {
            console.log(err);   
        }
    }
}

module.exports = component;