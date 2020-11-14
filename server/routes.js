let express = require("express");
let multer = require("multer");
let router = express.Router();
let signup = require("../controllers/signup");
let login = require("../controllers/login");
let profile = require("../controllers/profile");
let interact = require("../controllers/interact");
let chat = require("../controllers/chat");
const jwt = require("jsonwebtoken");
let fields = [
    {name: "firstname", maxCount: 1},
    {name: "lastname", maxCount: 1},
    {name: "email", maxCount: 1},
    {name: "phonenumber", maxCount: 1},
    {name: "username", maxCount: 1},
    {name: "password", maxCount: 1},
    {name: "file", maxCount: 1},
    {name: "filepath", maxCount: 1}
]
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./static/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, 'Interact-4f3f9382' + file.originalname )
    }
});
let upload = multer({storage});

//UTILS

module.exports = function(app) {
    //GET REQUESTS
    router.get("/", signup.view);
    router.get("/login", login.view);
    router.get("/signup", signup.view);
    router.get("/profile/:user", profile.view);
    router.get("/_profile/:user", profile._view);
    router.get("/interact/:user/posts", interact.viewPosts);
    router.get("/interact/:user/users", interact.viewUsers);
    router.get("/interact/:user/chat", interact.viewChat);
    router.get("/interact/:user/groupchat", interact.viewGroupChat);
    router.get("/chat/:peerA/:peerB/:roomType", chat.postPeerUsername);
    router.get("/chatroom/:peerA/:peerB/:roomName", chat.view);
    router.get("/groupchatroom/:currentUser/:roomName", chat.g_view);
    router.get("/g_chat/:currentUser/:roomName/:roomType", chat.group);

    //POST REQUESTS
    // router.post("/chat/txt", chat.textMsg);
    router.post("/profile/:user/post", upload.single("post-img"), profile.post);
    router.post("/profile/:user/group", upload.single("post-img"), profile.group);
    router.post("/signup", upload.fields(fields), signup.register);
    router.post("/login", login.access);
    router.post("/interact", interact.access);
    router.post("/profile", profile.access);
    app.use(router);
}