import mongoose from "mongoose";


const collection3 = "Message";


const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});


const messageModel = mongoose.model(collection3, messageSchema);

export default messageModel;