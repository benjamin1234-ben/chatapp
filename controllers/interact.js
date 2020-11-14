let db = require("../server/database");
let UserModel = db.userModel;
let PostModel = db.postModel;
let GroupModel = db.groupModel;
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");

let component = {
    viewPosts(req, res) {
        let user = req.params.user;
        UserModel.findOne({
            username: user,
        }).then(doc => {
            // console.log(doc);
            PostModel.find().limit(10)
            .then(docs => {
                let viewModel = {
                    user: {
                        username: doc.username,
                        email: doc.email,
                        phone: doc.phonenumber,
                        profilePic: `Interact-4f3f9382${doc.profilePic}`
                    },
                    posts: docs.reverse()
                }
                res.render("interact", viewModel);
            })
        }).catch(err => console.log(err));
    },
    viewUsers(req, res) {
        let user = req.params.user;
        UserModel.findOne({
            username: user,
        }).then(doc => {
            // console.log(doc);
            UserModel.find().limit(10)
            .then(docs => {
                // console.log(docs);
                let viewModel =  {
                    user: {
                        username: doc.username,
                        email: doc.email,
                        phone: doc.phonenumber,
                        profilePic: `Interact-4f3f9382${doc.profilePic}`
                    },
                    users: docs.filter(doc => doc.username !== user),
                };
                res.render("interact", viewModel);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    },
    viewChat(req, res) {
        let user = req.params.user;
        UserModel.findOne({
            username: user,
        }).then(doc => {
            // console.log(doc);
            UserModel.find().limit(10)
            .then(docs => {
                // console.log(docs);
                let array = [];
                for(let i = 0; i < docs.length; i++) {
                    let obj = {};
                    obj.username = docs[i].username;
                    obj.currentUser = user;
                    obj.profilePic = docs[i].profilePic;
        
                    array.push(obj);
                }
                // console.log(array);
                let viewModel =  {
                    user: {
                        username: doc.username,
                        email: doc.email,
                        phone: doc.phonenumber,
                        profilePic: `Interact-4f3f9382${doc.profilePic}`
                    },
                    users: array.filter(el => el.username !== user),
                };
                // console.log(viewModel.users)
                res.render("interact", viewModel);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    },
    viewGroupChat(req, res) {
        let user = req.params.user;
        UserModel.findOne({
            username: user,
        }).then(doc => {
            // console.log(doc);
            GroupModel.find().limit(10)
            .then(docs => {
                let array = [];
                for(let i = 0; i < docs.length; i++) {
                    let obj = {};
                    obj.groupName = docs[i].groupName;
                    obj.currentUser = user;
                    obj.groupImage = docs[i].groupImage;
                    obj.creator = docs[i].creator
        
                    array.push(obj);
                }
                let viewModel = {
                    user: {
                        username: doc.username,
                        email: doc.email,
                        phone: doc.phonenumber,
                        profilePic: `Interact-4f3f9382${doc.profilePic}`
                    },
                    groups: array
                };
                res.render("interact", viewModel);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    },
    access(req, res) {
        let authHeader = req.header("Authorization");
        let ACCESS_TOKEN = '00c9bb5e49c6cfce4062e4069a1cad9c';
        if(authHeader) {
            let token = authHeader.slice(7);
            if(token) {
                jwt.verify(token, ACCESS_TOKEN, (err, user) => {
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
    }
}

module.exports = component;