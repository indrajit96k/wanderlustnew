const User=require("./user.js"); 
const { object } = require("joi");
const mongoose=require("mongoose");
// mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
const reviewSchema=new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    }

})
const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;