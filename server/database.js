let mongoose = require("mongoose");
let database = "Interact";
let host = "127.0.0.1:27017";
let Schema = mongoose.Schema;

// Database connection
let connectDB = () => {
    mongoose.connect(`mongodb://${host}/${database}`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => {
        console.log("Connection to database was successful")
    }).catch((err) => {
        console.log(err);
    })
}

//Models and Schemas
let userSchema = new Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    email: { type: String, required: true},
    phonenumber: { type: String, required: true, minlength: 11, maxlength: 11},
    username: { type: String, required: true},
    profilePic: { type: String, required: true},
    password: { type: String, required: true}
})

let postSchema = new Schema({
    username: { type: String, required: true},
    profilePic: { type: String, required: true},
    postImage: { type: String, required: true},
    postContent: { type: String, required: true},
    createdAt: { type: Date, default: Date.now()}
})

let groupSchema = new Schema({
    creator: { type: String, required: true},
    groupImage: { type: String, required: true},
    groupName: { type: String, required: true},
    createdAt: { type: Date, default: Date.now()}
})

let p2pRoomSchema = new Schema({
    roomID: {type: String, required: true},
    roomType: {type: String, required: true},
    roomName : {type: String, required: true},
    messages: [
        {
            message: {type: String}, 
            timeStamp: {type: Date, default: Date.now()},
            username: {type: String}
        }
    ],
    users: [
        {type: String, required: true}
    ]
})

let groupRoomSchema = new Schema({
    roomID: {type: String, required: true},
    roomType: {type: String, required: true},
    roomName : {type: String, required: true},
    messages: [
        {
            message: {type: String}, 
            timeStamp: {type: Date, default: Date.now()},
            username: {type: String}
        }
    ],
    users: [
        {type: String, required: true}
    ]
})


let userModel = mongoose.model("User", userSchema);
let postModel = mongoose.model("Post", postSchema);
let groupModel = mongoose.model("Group", groupSchema);
let p2pRoomModel = mongoose.model("Room", p2pRoomSchema);
let groupRoomModel = mongoose.model("Grouproom", groupRoomSchema);

module.exports = { connectDB, userModel, postModel, groupModel, p2pRoomModel, groupRoomModel};