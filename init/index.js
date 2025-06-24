const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
//adding data in to db
const initdb=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"6843dadbbddc28e28d8efeb8"}));
    await Listing.insertMany(initdata.data);
    console.log("Initial data added");

}
initdb();