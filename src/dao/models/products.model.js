import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const producSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    code:{
        type: String,
        require: true
    },
    stock:{
        type: Number,
        require: true
    },
    category:{
        type: String,
        require: true
    }
})

producSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model("products", producSchema);

export default productsModel;