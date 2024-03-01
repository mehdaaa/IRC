import Message from "../models/messageModel.js";
import Room from "../models/roomModel.js";
import User from "../models/userModel.js";
class Repository {

    /* MESSAGES */

    // Save the message in database
    async saveMessage(message){

        if (!message){
            return "No message provided";
        }
        else {
            const newMessage = new Message({
                room: message.room,
                author: message.author,
                message: message.message,
                dateTime: message.dateTime
            })

            return await newMessage
                .save()
                .then(() => {console.log("Message saved")})
                .catch ((e) => {return e.message})
        }

    }

    // Fetch all messages of a room
    async fetchMessageByRoom(room){

        if (!room) {
            return "no room provided";
        } else {

            try {
                const messagesByRoom = await Message.find({ room: room });
                console.log("Messages found");
                return messagesByRoom;
            } catch (error) {
                console.error(error.message);
                return "cannot find messages";
            }
        }
    }




    /* ROOMS */

    // Returns all the rooms
    async getRooms() {
        try {
            const allRooms = await Room.distinct("name");
            console.log("Rooms found:", allRooms);
            return allRooms;
        } catch (error) {
            return "Error fetching rooms: " + error.message;
        }
    }

    // Returns all infos of a room
    async getRoomByRoomName(room){
        try{
            if (!room || !room.name) {
                return "No room provided";

            } else {
                const roomReturned = await Room.findOne({ name: room.name });

                if (!roomReturned) {
                    return "No room found";
                }
                else {
                    console.log("Founded: ", roomReturned);
                    return roomReturned;
                }
            }
        } catch (error){
            return "Error fetching data: " + error.message;
        }
    }

    // Add room in database
    async createRoom(room) {

        if (!room || !room.name) {
            return "no room name provided";
        } else {
            const newRoom = new Room({
                name: room.name,
                users: room.users,
                isGroup: room.isGroup
            })

            const existingRoomNames = await Room.distinct('name');

            if(existingRoomNames.includes(newRoom.name)){
                return "Room already exists";
            }else{
                 await newRoom
                    .save()
                    .then(() => {
                        console.log("Room saved");
                    })
                    .catch((e) => {
                        return "Error while creating room: " + e.message;
                    })
            }
        }
    }

    // delete room from database
    async deleteRoom(room){

        try {
            if (!room || !room.name) {
                return "No room or user provided";
            }

            const existingRooms = await Room.distinct('name');

            if(!existingRooms.includes(room.name)){
                return "Room does not exist";

            } else {
                await Room.deleteOne({name:room.name});
                console.log("room "+room.name+" deleted");
            }

        } catch (error) {
            return "Error deleting room: " + error.message;
        }
    }

    // Update room name || needs a JSON object with 'name', 'newName' & 'username' keys
    async updateRoom(room){
        try {
            if (!room || !room.name || !room.newName) {
                return "No room or user provided";
            }

            const existingRoom = await Room.findOne({name: room.name});
            if (!existingRoom) {
                return "Room does not exist";

            } else if (room.user === existingRoom.users[0]){
                await Room.updateOne({name: room.name},{ $set: {name: room.newName}});
                console.log("Room name updated to "+room.newName);
            } else {
                console.log("Permission denied")
                return "Permission denied";
            }


        } catch (error) {
            return "Error updating room : " + error.message;
        }
    }

    // Add user's username in the room's users array
    async joinRoom(room) {
        try {
            if (!room || !room.name) {
                return "No room or user provided";
            }

            const existingRoom = await Room.findOne({name: room.name});
            if (!existingRoom) {
                return "Room does not exist";

            } else if (existingRoom.users.includes(room.users)) {
                return "Username already in the room";

            /*console.log("User "+ room.users +" joined the room");*/
              
            } else {
                await Room.updateOne(
                    {name: room.name},
                    {$push: {users: room.users}}
                );
                return {message:"success"}
                /*console.log("User "+ room.users +" joined the room");*/
            }


        } catch (error) {
            return "Error joining room: " + error.message;
        }
    }

    // Remove username from the room's users array
    async leaveRoom(room){
        try {
            if (!room || !room.name) {
                return "No room or user provided";
            }

            const existingRoom = await Room.findOne({name: room.name});
            if (!existingRoom) {
                return "Room does not exist";

            } else if (!existingRoom.users.includes(room.users)) {
                return "User already leaved the room";

            } else {
                await Room.updateOne(
                    { name: room.name },
                    { $pull: { users: room.users } }
                );

                console.log("User "+ room.users +" leaved the room");
            }

        } catch (error) {
            return "Error leaving room: " + error.message;
        }
    }

// Return the list of rooms that contains the keyword || need a JSON with the 'keyword' key
    async getRoomsByKeyword(keyword){
        try{
            if (!keyword || !keyword.keyword) {
                return "No keyword provided";

            } else {
                const regex = new RegExp(keyword.keyword, 'i');
                const keywordRooms = await Room.find({ name: { $regex: regex }});

                if (!keywordRooms) {
                    return "No room for this keyword";
                }
                else {
                    return keywordRooms;
                }
            }
        } catch (error){
            return "Error fetching data: " + error.message;
        }
    }





    /* Users */

    // Returns all users in database
    async getUsers(){}

    // Add user in database
    async createUser(user){
        if (!user || !user.username || user.username.startsWith(" ")) {
            return "no username provided";
        } else {
            const newUser = new User({
                username: user.username,
            })

            const existingUsernames = await User.distinct('username');

            if(existingUsernames.includes(newUser.username)){
                return "Username already exists";
            }else{
                return await newUser
                    .save()
                    .then(() => {
                        console.log("Username saved");
                    })
                    .catch((e) => {
                        return "Error creating user: " + e.message;
                    })
            }
        }

    }

    // Get user's rooms
    async getJoinedRooms(user){
        try{
            if (!user) {
                return "No user provided";

            } else {
                const userRooms = await Room.find({users: { $in: [user] }});

                if (!userRooms) {
                    return "No room joined";
                }
                else {
                    // console.log("Founded: ", userRooms);
                    // console.log(userRooms)
                    let tabJoinedRooms = [];
                    for (let i = 0; i < userRooms.length; i++) {
                        tabJoinedRooms.push(userRooms[i].name);
                    }

                    return tabJoinedRooms;
                }
            }
        } catch (error){
            return "Error fetching data: " + error.message;
        }
    }

    // delete user from database
    async deleteUser(user){

        try {
            if (!user || !user.username) {
                return "No username provided";
            }

            const existingUsers = await User.distinct('username');

            if(!existingUsers.includes(user.username)){
                return "Username does not exist";

            } else {
                await User.deleteOne({username:user.username});
                console.log("user "+user.username+" deleted");
            }

        } catch (error) {
            return "Error deleting user: " + error.message;
        }
    }

    // Update username
    async updateUser(username){}


    async clearDatabase() {
        await Room.deleteMany()
        await User.deleteMany()                 // CLEAR LA DB ET SUPPRIMER AVANT LE RENDU
        await Message.deleteMany()
    }
}
export default Repository;