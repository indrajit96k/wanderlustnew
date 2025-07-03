if(process.env.NODE_ENV != "production") {
    require('dotenv').config();

} 
const express=require("express");
const app=express();
const path=require("path");
const WrapAsync=require("./utils/wrapasync.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingschema, reviewschema } = require("./schema.js");
const session = require('express-session');
const MongoStore=require("connect-mongo")
const Review=require("./models/review.js"); 
const flash=require("connect-flash");
const listingroute=require("./routes/listing.js");
const reviewroute=require("./routes/review.js");
const userroute=require("./routes/user.js");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
app.engine("ejs",ejsmate);
app.use(methodoverride("_method"));
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const passport=require("passport");
const localstrategy=require("passport-local");
const User=require("./models/user.js");
const { error } = require('console');
let dburl=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("Connected to Db");
}).catch((err)=>{
    console.log("error Occured",err);
})
async function main() {
    await mongoose.connect(dburl);
    
}
app.listen(8080,()=>{
    console.log("Server listenening");
})

const sessionoptions={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }

};
app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();

})
app.use("/",userroute);
app.use("/listings",listingroute);
app.use("/listings/:id/reviews",reviewroute);
app.get("/searchresults",async(req,res)=>{
    let {destinations}=req.query;
    let searchlistings= await Listing.find({location:{$regex: destinations, $options: "i"}});
    res.render("listings/searchresult.ejs",{searchlistings});
})
app.get("/filters",async(req,res)=>{
    let {filter}=req.query;
    // let filterlistings=await Listing.find({description:{$regex:filter,$options:"i"}});
    let filterlistings=await Listing.find({tags:filter});
    res.render("listings/filter.ejs",{filterlistings});
})
//for all request definging err handling middleware for page not found
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})
app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something Went Wrong!"}=err;
    // res.status(statuscode).send(message);
    res.status(statuscode).render("listings/error.ejs",{message});
    // res.send("Something Went Wrong");
})