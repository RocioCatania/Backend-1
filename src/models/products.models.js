import mongoose from "mongoose"

const productsSchema = new mongoose.Schema({
    title:String,
    description:String,
    code:String,
    price:Number,
    status:Boolean,
    category:String,
    thumbnails:Array
})

export const productsModels = mongoose.model("products", productsSchema);

