let db = require("../server/database");
let UserModel = db.userModel;
let GroupModel = db.groupModel;
let P2pRoomModel = db.p2pRoomModel;
let GroupRoomModel = db.groupRoomModel;
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");

let component = {
    view(req, res) {
        let roomName = req.params.roomName;
        let userA = req.params.peerA;
        let userB = req.params.peerB;

        UserModel.find({$or:[{username: userA}, {username: userB}]})
        .then(docs => {
            let peerA = docs.filter(doc => doc.username === userA)[0];
            let peerB = docs.filter(doc => doc.username === userB)[0];

            P2pRoomModel.findOne({
                roomName: roomName
            }).then(room => {
                // console.log(room);
                let viewModel = {
                    user: peerA,
                    roomName,
                    messages: room.messages,
                    userA: peerA,
                    userB: peerB
                }
                res.render("chat", viewModel);
            })
        })
    },
    g_view(req, res) {
        let roomName = req.params.roomName;
        let currentUser = req.params.currentUser;
        // console.log(req.params);

        UserModel.findOne({username: currentUser})
        .then(doc => {
            GroupModel.findOne({
                groupName: roomName
            }).then(_room => {
                GroupRoomModel.findOne({
                    roomName: roomName
                }).then(room => {
                    // console.log(room);
                    let viewModel = {
                        user: doc,
                        groupName: room.roomName,
                        messages: room.messages,
                        image: _room.groupImage
                    }
                    res.render("groupchat", viewModel);
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        })
    },
    group(req,res) {
        let user = req.params.currentUser;
        let roomType = req.params.roomType;
        let roomName = req.params.roomName;
        // console.log(req.params);
        GroupModel.findOne({
            groupName: roomName
        }).then(room => {
            // console.log(room);
            GroupRoomModel.find({
                roomName: room.groupName
            }).then(docs => {
                if(docs.length === 0) {
                    let group = new GroupRoomModel({
                        roomID: room.id,
                        roomName: room.groupName,
                        roomType: roomType,
                        users: [user]
                    })
                    group.save()
                    .then(doc => {
                        // console.log(doc);
                        res.redirect(`/groupchatroom/${user}/${doc.roomName}`);
                    }).catch(err => console.log(err));
                } else {
                    GroupRoomModel.findOne({
                        roomName: roomName
                    }).then(doc => {
                        let _user = doc.users.includes(user);
                        if(!_user) {
                            doc.users.push(user);
                            doc.save()
                            .then(doc => {
                                // console.log(doc);
                                res.redirect(`/groupchatroom/${user}/${doc.roomName}`);
                            }).catch(err => console.log(err));
                        } else {
                            res.redirect(`/groupchatroom/${user}/${docs[0].roomName}`);
                        }
                    })
                }
            })
        })
    },
    postPeerUsername(req, res) {
        let param = req.params;
        let roomType = req.params.roomType;
        // console.log(param);

                    let peerA_username = param.peerA;
                    let peerB_username = param.peerB;
                    UserModel.find({$or:[{username: peerA_username}, {username: peerB_username}]})
                    .then(docs => {
                        // console.log(docs);
                        let peerA = docs.filter(doc => doc.username === peerA_username);
                        let peerA_ID = peerA[0].id;
                        let peerB = docs.filter(doc => doc.username === peerB_username);
                        let peerB_ID = peerB[0].id;
                        // console.log(peerA_ID);
                        // console.log(peerB_ID);
                        P2pRoomModel.find({$or:[
                            {roomID: peerA_ID + "." + peerB_ID},
                            {roomID: peerB_ID + "." + peerA_ID}
                        ]}).then(doc => {
                            // console.log(doc);
                            if(doc.length === 0) {
                                let room = new P2pRoomModel({
                                    roomID: peerA_ID + "." + peerB_ID,
                                    roomName: peerA_username + "-" + peerB_username,
                                    users: [peerA_username, peerB_username],
                                    roomType: roomType
                                }).save()
                                .then(doc => {
                                    // console.log(doc);
                                    let roomName = peerA_username + "-" + peerB_username;
                                    // console.log(roomName)
                                    res.redirect(`/chatroom/${peerA_username}/${peerB_username}/${roomName}`);
                                }).catch(err => console.log(err));
                            } else {
                                let peerA = doc[0].users.filter(user => user === peerA_username);
                                let peerB = doc[0].users.filter(user => user === peerB_username);
                                res.redirect(`/chatroom/${peerA}/${peerB}/${doc[0].roomName}`);
                            }
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
    }
}

module.exports = component;