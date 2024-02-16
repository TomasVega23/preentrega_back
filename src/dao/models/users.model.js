import mongoose from "mongoose";

const usercollection = "Users";

const schema = new mongoose.Schema({
    first_name:{
        type:String,
        require:true
    },
    last_name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        require:true
    },
    rol:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
});

const userModel = mongoose.model(usercollection,schema);

export default userModel;