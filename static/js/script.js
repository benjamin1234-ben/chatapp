//SELECTORS
    // LOGIN COMPONENT
        let loginForm = document.querySelector("#login");
        let login_username = document.querySelector("#login_username");
        let login_password = document.querySelector("#login_password");
    
    // REGISTER COMPONENT
        let registerForm = document.querySelector("#register");
        let register_firstname = document.querySelector("#register_firstname");
        let register_lastname = document.querySelector("#register_lastname");
        let register_email = document.querySelector("#register_email");
        let register_phonenumber = document.querySelector("#register_phonenumber");
        let register_username = document.querySelector("#register_username");
        let register_password = document.querySelector("#register_password");
        let profile_pic = document.querySelector("#file");
    
    // PROFILE COMPONENT
        let postBtn = document.querySelector("#post");
        let groupBtn = document.querySelector("#create");
        let postForm = document.querySelector("#postForm");
        let makePost = document.querySelector('#makePost');
        let makeGroup = document.querySelector('#makeGroup');

    // CHAT COMPONENT
        let sendBtn = document.querySelector("#send-btn");
        let msg = document.querySelector("#msg");
        let reciever = document.querySelector("#reciever");
        let sender = document.querySelector("#sender");
        let room_name = document.querySelector("#roomName");
        let uploader = document.querySelector("#uploader");
        let uploaded = document.querySelector("#uploaded");
        let chatContent = document.querySelector("#mainChat");

    // GROUP CHAT COMPONENT
        let g_sendBtn = document.querySelector("#g-send-btn");
        let g_msg = document.querySelector("#g-msg");
        let g_sender = document.querySelector("#g-sender");
        let g_room_name = document.querySelector("#g-roomName");
        let g_uploader = document.querySelector("#g-uploader");
        let g_uploaded = document.querySelector("#g-uploaded");
        let g_chatContent = document.querySelector("#g-mainChat");
    
    // HOME COMPONENT
        let posts = document.querySelector("#posts");
        let users = document.querySelector("#user");
        let chat = document.querySelector("#chats");
        let groupchat = document.querySelector("#groupchat");
        let like = document.querySelector("#like");
        let dislike = document.querySelector("#dislike");
        let comments = document.querySelectorAll(".comment");
        let decomments = document.querySelectorAll(".decomment");
        let textcomment = document.querySelectorAll(".text-comment");
        let chatBtn = document.querySelector(".chatBtn");

//EVENT LISTENERS
    //CHAT COMPONENT
        if(/\/chatroom/.test(window.location.pathname)) {
            chatContent.scrollTop = chatContent.scrollHeight;
            uploader.addEventListener("click", (e) => {
                uploaded.style.display = "block";
            })
            let socket = io();

            let data = {
                room: room_name.innerText,
                sender: sender.innerText
            } 
            let formdata = JSON.stringify(data);
            socket.emit("joinRoom", data);

            socket.on("message", (msg) => {
                alert(msg);
            })
            socket.on("roommessage", (msg) => {
                // console.log(msg)
                let data = JSON.parse(msg);
                window.location.assign(`http://localhost:8080/chatroom/${data.reciever_username}/${data.sender_username}/${data.roomName}`);
            })

            sendBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let data = {
                    message: msg.value,
                    sender_username: sender.innerText,
                    reciever_username: reciever.innerText,
                    roomName: room_name.innerText
                }
                console.log(data);
                let formData = JSON.stringify(data);
                socket.emit("roomMsg", formData);
                window.location.assign(`http://localhost:8080/chatroom/${data.sender_username}/${data.reciever_username}/${data.roomName}`);
            })

        };

    //GROUPCHAT COMPONENT
    if(/\/groupchatroom/.test(window.location.pathname)) {
        g_chatContent.scrollTop = g_chatContent.scrollHeight;
        g_uploader.addEventListener("click", (e) => {
            g_uploaded.style.display = "block";
        })
        let socket = io();

        let data = {
            room: g_room_name.innerText,
            sender: g_sender.innerText.slice(11)
        } 
        let formdata = JSON.stringify(data);
        socket.emit("joinGroup", formdata);

        socket.on("message", (msg) => {
            alert(msg);
        })
        socket.on("groupmessage", (msg) => {
            // console.log(msg)
            let formdata = JSON.parse(msg);
            window.location.assign(`http://localhost:8080/groupchatroom/${data.sender}/${formdata.roomName}`);
        })

        g_sendBtn.addEventListener("click", (e) => {
            e.preventDefault();
            let data = {
                message: g_msg.value,
                sender_username: g_sender.innerText.slice(11),
                roomName: g_room_name.innerText
            }
            // console.log(data);
            let formData = JSON.stringify(data);
            socket.emit("groupMsg", formData);
            window.location.assign(`http://localhost:8080/groupchatroom/${data.sender_username}/${data.roomName}`);
        })

    };

    // PROFILE COMPONENT
        if(/\/profile/.test(window.location.pathname)) {
           postBtn.addEventListener("click", (e) => {
               makePost.style.display = "block";
           })
           groupBtn.addEventListener("click", (e) => {
            makeGroup.style.display = "block";
            })
        }

    //LOGIN COMPONENT
        if(window.location.pathname === "/login") {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
    
                let formData = {
                    username: login_username.value,
                    password: login_password.value
                };
    
                fetch("http://localhost:8080/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData),
                    redirect: "follow"
                }).then(res => res.json())
                .then(data => {
                    // console.log(data);
                    sessionStorage.setItem("accessToken", data.accessToken);

                    fetch(`http://localhost:8080/interact`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${data.accessToken}`
                        }
                    }).then(res => res.json())
                    .then(data => {
                        // console.log(data);
                        window.location.assign(`http://localhost:8080/interact/${data}/posts`);
                    })
                }).catch(err => console.log(err));
            });
        } 

    // HOME COMPONENT 
    if(/\/interact/.test(window.location.pathname)) {
        if(/\/posts/.test(window.location.pathname)) {
            // console.log(posts)
            posts.style.display = "block";
        } else if(/\/users/.test(window.location.pathname)) {
            // console.log(users)
            users.style.display = "block";
        } else if(/\/chat/.test(window.location.pathname)) {
            // console.log(chat)
            chat.style.display = "block";
        } else if(/\/groupchat/.test(window.location.pathname)) {
            groupchat.style.display = "block";
        }
        comments.forEach(comment => {
            comment.addEventListener("click", (e) => {
                textcomment[e.taget.id].style.display = "block";
            })
        })
        decomments.forEach(decomment => {
            decomment.addEventListener("click", (e) => {
                textcomment.style.display = "none";
            })
        })
    }

    //REGISTER COMPONENT
        // if(window.location.pathname === "/" || window.location.pathname === "/signup") {
        //     registerForm.addEventListener("submit", (e) => {
        //         e.preventDefault();
        
        //         let formData = {
        //             firstname: register_firstname.value,
        //             lastname: register_lastname.value,
        //             email: register_email.value,
        //             phonenumber: register_phonenumber.value,
        //             username: register_username.value,
        //             password: register_password.value
        //         };
                
        //         fetch("http://localhost:8080/signup", {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json"
        //             },
        //             body: formData,
        //             redirect: "follow"
        //         }).then(res => res.json())
        //         .then(data => {
        //             console.log(data);
        //             sessionStorage.setItem("accessToken", data.accessToken)
        //             window.location.assign(`http://localhost:8080/profile/${formData.username}`);

        //             fetch(`http://localhost:8080/profile`, {
        //                 method: "POST",
        //                 headers: {
        //                     Authorization: `Bearer ${data.accessToken}`
        //                 }
        //             }).then(res => res.json())
        //             .then(data => {
        //                 window.location.assign(`http://localhost:8080/profile/${data}`);
        //             })
        //         }).catch(err => console.log(err));
        //     });   
        // }