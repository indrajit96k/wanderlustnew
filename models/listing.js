const mongoose=require("mongoose");
const Review=require("./review.js");
const User=require("./user.js"); 
// mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
const listingschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    image: {
        filename:{
            type:String
        },
        url:{
            type:String
        }
        

    },
    price:{
        type:Number
    },
    location:{
        type:String,
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    tags:{
        type:String,
        default:"Trending"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],//latitude and longitude
            required:true
        }
    }

});
listingschema.post("findOneAndDelete",async(listingdata)=>{
    if(listingdata){
        await Review.deleteMany({_id:{$in:listingdata.reviews}});

    }

    
    // console.log("deleted reviews of this listing");

})
const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;