import mongoose from "mongoose";

const messageModel = mongoose.Schema({
    room: {type: String, required: true, unique: false},
    author: {type: String, required: true},
    message:{type: String, required: true, unique: false},

    dateTime:{type: Date, default: Date.now()}
});

const Message = mongoose.model("Message",messageModel);
export default Message;

