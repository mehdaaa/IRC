import mongoose from "mongoose";

const userModel = mongoose.Schema({
    username: {type: String, required: true, unique: false}
});

const User = mongoose.model("User",userModel);
export default User;
