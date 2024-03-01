import mongoose from "mongoose";

const roomModel = mongoose.Schema({
    name: {type: String, required: true, unique: false},
    users: [{type: String}],
    isGroup: {type: Boolean, required: true, default: true}
});

const Room = mongoose.model("Room",roomModel);
export default Room;
