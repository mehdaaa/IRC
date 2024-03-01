import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Login from './components/Login';
import {socket} from './socket';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [channelsList, setChannelsList] = useState([]);
    const [joinedRooms, setJoinedRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState("");
    const [activeTab, setActiveTab] = useState("commands");

    function handleMessage() {

        let text = message.split(" ");

        if (message[0] === "/") {

            if (message.startsWith("/create") && text.length === 2) {
                const roomData = {
                    name: text[1],
                    users: username
                }
                socket.emit("create_room", roomData);

            } else if (message.startsWith("/nick") && text.length === 2) {
                socket.emit("update_name", username, text[1]);

            } else if (message.startsWith("/delete") && text.length === 2) {
                const roomData = {
                    name: text[1],
                    users: username
                }
                socket.emit("delete_room", roomData);

            } else if (message.startsWith("/join") && text.length === 2) {
                const roomData = {
                    name: text[1],
                    users: username
                }
                socket.emit("join_room", roomData);

            } else if (message.startsWith("/quit") && text.length === 2) {
                const roomData = {
                    name: text[1],
                    users: username
                }
                socket.emit("quit_room", roomData);

            }

            /*else if (message.startsWith("/list") && message.length === 2) {
                const data = {
                    keyword: text[1]
                }
                socket.emit("get_channels_keyword", data);

            } */

            else if (message === "/list") {
                    socket.emit("get_channels");

            } else if (message === "/users" && activeRoom !== "") {
                const roomData = {
                    name: activeRoom
                }
                socket.emit("get_users", roomData);

            } else if (message.startsWith("/room") && activeRoom !== "" && text.length === 2){
                const roomData = {
                    name: activeRoom,
                    newName: text[1],
                    user: username
                }
                socket.emit("update_room_name", roomData);

            } else if (message === "/commands") {
                setActiveTab("commands");

            } else if (message.startsWith("/msg")){
                const messageData = {

                }
            }
        } else {
            if(activeRoom !== ""){
                const messageData = {
                    room: activeRoom,
                    author: username,
                    message: message,
                    dateTime:
                        Date.now(),
                }
                console.log("emit message")
                socket.emit("send_message", messageData);
            } else {
                toast.error("No room selected", {toastId:message});
                }
            }
        }

  function chooseName(name) {
        const data = {
            username: name
        }
        socket.emit("choose_name", data);
  }

  function askMessagesOfRoom(room) {
        socket.emit("get_messages", room)
    }

    useEffect(() => {

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on("connected", onConnect);
        socket.on("disconnected", onDisconnect);

        socket.on("set_name", (username) => {
            setUsername(username);
        })

          socket.on("receive_message", (data) => {
              setMessageList(data);
          })

          socket.on("display_messages", (data, room) => {
              setActiveRoom(room);
              setMessageList(data);
              setActiveTab("messages")
          })

        socket.on("display_rooms", (data) => {
            setActiveTab("channels");
            setActiveRoom("")
            setChannelsList(data);
        })

        socket.on("display_users", (data) => {
            setActiveTab("users");
            setActiveRoom("")
            setUsersList(data);
        })

          socket.on("room_joined", (data) => {
              setJoinedRooms(data);
          })

        socket.on("error", (message) => {
            toast.error(message, {toastId:message});
        })

        socket.on("success", (message) => {
            toast.success(message, {toastId:message});
        })

         return () => {
             socket.off('connected', onConnect);
             socket.off('disconnected', onDisconnect);
              socket.off("set_name");
              socket.off("receive_message");
              socket.off("display_messages");
              socket.off("new_room");
              socket.off("room_joined");
              socket.off("room_deleted");
              socket.off("leave_room");
          }

        }, [messageList,setMessageList]);

        return (
            <>
            <ToastContainer />
            <div className="App">

                {username ?
                    <>
                        <Header
                            username={username}/>

                        <Sidebar
                            joinedRooms={joinedRooms}
                            askMessagesOfRoom={askMessagesOfRoom}
                            activeRoom={activeRoom}
                        />

                        <Main
                            setMessage={setMessage}
                            messageList={messageList}
                            activeRoom={activeRoom}
                            channelsList={channelsList}
                            usersList={usersList}
                            activeTab={activeTab}
                            handleMessage={handleMessage}/>
                    </>
                    :

                    <Login chooseName={chooseName}/>}
            </div>
            </>
        );
    }

    export default App;