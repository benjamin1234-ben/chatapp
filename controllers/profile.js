let db = require("../server/database");
let UserModel = db.userModel;
let GroupModel = db.groupModel;
let PostModel = db.postModel;
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");

let component = {
    view(req, res) {
        let user = req.params.user;
        UserModel.findOne({
            username: user,
        }).then(doc => {
            // console.log(doc);
            let viewModel = {
                username: doc.username,
                email: doc.email,
                phone: doc.phonenumber,
                profilePic: `Interact-4f3f9382${doc.profilePic}`
            }
            res.render("profile", viewModel);
        }).catch(err => console.log(err));
    },
    _view(req, res) {
        let user = req.params.user;
        UserModel.findOne({
            username: user,
        }).then(doc => {
            // console.log(doc);
            let viewModel = {
                username: doc.username,
                email: doc.email,
                phone: doc.phonenumber,
                profilePic: `Interact-4f3f9382${doc.profilePic}`
            }
            res.render("_profile", viewModel);
        }).catch(err => console.log(err));
    },
    access(req, res) {
        let authHeader = req.header("Authorization");
        if(authHeader) {
            let token = authHeader.slice(7);
            if(token) {
                jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
                    if(err)
                        res.sendStatus(500);
                    else
                        // console.log(user);
                        res.json(user.username);
                        // console.log(user.username);
                })
            }
            // res.redirect("/login");
        }
        // res.redirect("/login");
    },
    post(req, res) {
        let user = req.params.user;
        let body = req.body;
        UserModel.findOne({
            username: user
        }).then(doc => {
            let post =  new PostModel({
                username: doc.username,
                profilePic: doc.profilePic,
                postImage: body.filepath,
                postContent: body.postDesc
            })
            post.save().then(post => {
                // console.log(post);
                res.redirect("/interact/" + doc.username + "/posts")
            }).catch(err => console.log(err));
        })
    },
    group(req, res) {
        let user = req.params.user;
        let body = req.body;
        UserModel.findOne({
            username: user
        }).then(doc => {
            let group = new GroupModel({
                creator: doc.username,
                groupImage: body.filepath,
                groupName: body.groupname
            }).save((err, group) => {
                if(err) {
                    console.log(err);
                } else {
                    // console.log(doc);
                    res.redirect("/interact/" + doc.username + "/groupchat");
                }
            })
        })
    }
}

module.exports = component;