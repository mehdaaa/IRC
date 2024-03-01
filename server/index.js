import express from "express";
const app = express();

import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import Repository from "./data/Repository.js";
import dbConnect from "./config/db.js";


app.use(cors());

const repository = new Repository();
dbConnect();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

/*io.listen(3002);*/

app.get('/', (req, res) => {
    res.send("API ok");
});

let usersSocketName=[]


io.on("connection", (socket) => {
    /*console.log("User " + socket.id + " connected");*/
    socket.emit("connected");

    socket.on("choose_name", (data) => {
        repository.createUser(data).then((res) => {
            if(typeof res === "string"){
                socket.emit("error", res);
            } else {

                console.log(data.username + " is connected");
                /*console.log(usersSocketName.length);*/
                usersSocketName.push({socket:socket,
                            name:data.username})
                socket.emit("set_name", data.username);
                socket.emit("success", "Welcome " + data.username)
            }
        })
    });

    socket.on("update_name", (oldName, newName) => {
        socket.emit("set_name", newName);
    });

    socket.on("create_room", (data) => {
        repository.createRoom(data).then((res) => {
            if(typeof res === "string"){
                socket.emit("error", res)
            } else {
                socket.join(data.name);
                repository.getJoinedRooms(data.users).then((res) => {
                    socket.emit("room_joined", res);
                    socket.emit("success", data.name + " has been created ")
                })}
        });
    });

    socket.on("join_room", (data) => {
        repository.joinRoom(data).then((res) => {
            if(typeof res === "string"){
                socket.emit("error", res)
            } else {
                socket.join(data.name);
                repository.getJoinedRooms(data.users).then((res) => {
                    socket.emit("room_joined", res);
                    socket.to(data.name).emit("success", data.users + " has joined the room : " + data.name)
                })}
        });
    });

   socket.on("get_messages", (room) => {
        repository.fetchMessageByRoom(room).then((data) => {
            if (data instanceof String){
                socket.emit("error", data)
            } else {
                socket.emit("display_messages", data, room);
            }
        });
    });

   socket.on("get_channels", () => {
       repository.getRooms().then((data) =>{
           if (data instanceof String){
               socket.emit("error", data)
           } else {
               socket.emit("display_rooms", data);
           }
       })
    });

  /*  socket.on("get_channels_keyword", (keyword) => {
        console.log(keyword.keyword);
        repository.getRoomsByKeyword(keyword.keyword).then((data) =>{
            if (data instanceof String){
                socket.emit("error", data)
            } else {
                socket.emit("display_rooms", data);
            }
        })
    });*/

   socket.on("get_users", (data) => {
       repository.getRoomByRoomName(data).then((res) => {
           if (data instanceof String){
               socket.emit("error", res)
           } else {
               socket.emit("display_users", res.users);
           }
       })
   })

   socket.on("delete_room", (data) => {
       repository.deleteRoom(data).then((res) => {
           if (typeof res === "string") {
               socket.emit("error", res)
           } else {
               io.to(data.name).emit(data.name + ' has been deleted')
                        repository.getJoinedRooms(data.users).then((res) => {
                            socket.emit("room_joined", res);
                        })}
    })
   });

   socket.on("quit_room", (data) => {
        repository.leaveRoom(data).then((res) => {
            if (typeof res === "string") {
                socket.emit("error", res)
            } else {
                socket.leave(data.name);
                repository.getJoinedRooms(data.users).then((res) => {
                socket.emit("room_joined", res);
                socket.to(data.name).emit("success", data.users + " has leave the room : " + data.name)
            })}
       })
    });

   socket.on("update_room_name", (data) =>{
       repository.updateRoom(data).then((res) =>{
       if (typeof res === "string") {
           socket.emit("error", res)
       } else {
           repository.getJoinedRooms(data.user).then((res) => {
               socket.emit("room_joined", res);
           })
       }
   })
});

   socket.on("send_message", (data) => {
        repository.saveMessage(data).then((res)=>{
            repository.fetchMessageByRoom(data.room).then((messages)=>{
                io.to(data.room).emit("receive_message", messages);
            });
        });
   });

   socket.on("disconnect", () => {
       for (let i = 0; i < usersSocketName.length; i++) {
          if(socket=== usersSocketName[i].socket){
              console.log(usersSocketName[i].name + " has disconnected")
          }
       }
        });
    });

server.listen(3001, () => {
    console.log('Server is running');
});