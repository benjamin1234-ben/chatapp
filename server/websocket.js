let http = require("http");
let mongoose = require("mongoose");
let socketio = require("socket.io");
let db = require("./database");
let app = require("./index");
let connectDB = db.connectDB;
let UserModel = db.userModel;
let GroupRoomModel = db.groupRoomModel;
let P2pRoomModel = db.p2pRoomModel;

let server = http.createServer(app);

let io = socketio(server);

io.on("connection", (socket) => {
    // console.log(socket);
    // io.emit("message", "connected to socket io");
    socket.on("joinRoom", (msg) => {
        // console.log(msg);
        socket.join(msg.room);
        socket.broadcast.to(msg.room).emit("message", msg.sender + " has connected to " + msg.room + " room");
    });
    socket.on("roomMsg", (data) => {
        let obj = JSON.parse(data);
        // console.log(obj);
        P2pRoomModel.findOne({
            roomName: obj.roomName,
        }).then(doc => {
            // console.log(doc);
            doc.messages.push({
                message: obj.message,
                username: obj.sender_username
            })
            doc.save((err, doc) => {
                if(err)     
                    console.log(err);
                // console.log(obj);
                let formData = JSON.stringify(obj);
                socket.broadcast.to(obj.roomName).emit("roommessage", formData);
            })
        })
    })
    socket.on("joinGroup", (msg) => {
        let data = JSON.parse(msg);
        socket.join(data.room);
        socket.broadcast.to(data.room).emit("message", data.sender + " has entered " + data.room + " room");
    });
    socket.on("groupMsg", (data) => {
        let obj = JSON.parse(data);
        // console.log(obj);
        GroupRoomModel.findOne({
            roomName: obj.roomName,
        }).then(doc => {
            // console.log(doc);
            doc.messages.push({
                message: obj.message,
                username: obj.sender_username
            })
            doc.save((err, doc) => {
                if(err)     
                    console.log(err);
                // console.log(obj);
                let formData = JSON.stringify(obj);
                socket.broadcast.to(obj.roomName).emit("groupmessage", formData);
            })
        })
    })
})

io.listen(server);

connectDB();

server.listen(8080, err => {
    if(err)
        console.log(`Error connecting to server on port 8080`);
    else 
        console.log(`Connection to server is successful on port 8080`);
})