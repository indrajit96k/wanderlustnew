const express=require("express");
const router=express.Router();
const WrapAsync=require("../utils/wrapasync.js");
const { listingschema, reviewschema } = require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage}); //for file upload
const {isloggedin, isowner}=require("../middelware.js");
const getCoordinates=require("../utils/geocoder.js");
const { ContactOwner} = require("../utils/ownermessage.js");

const validateListing=(req,res,next)=>{
        //use joi validation for schema 
    let {error}=listingschema.validate(req.body.listing);
        // console.log(x);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
}
router.get("/",WrapAsync(async(req,res)=>{
    const alldata=await Listing.find();
    res.render("listings/index.ejs",{alldata});
}));
router.get("/new",isloggedin,(req,res)=>{
    res.render("listings/newlisting.ejs");
})
router.get("/:id", WrapAsync(async(req,res)=>{
    let {id}=req.params;
    const indvidual= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");//nested populating for reviews to acces its userreview and simple populating for owner of listing 
    if(!indvidual){
        req.flash("error","Listing Not Found!");
        res.redirect("/listings");
    }
    console.log(indvidual);
    res.render("listings/show.ejs",{indvidual});

}));
router.post("/", isloggedin, upload.single('listing[image]'),validateListing, WrapAsync(async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const coordinates=await getCoordinates(req.body.location);
    // console.log(url,"...",filename);
    const newlisting = new Listing(req.body);
    newlisting.owner=req.user._id;
    newlisting.geometry=coordinates;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New Listing Created!!!");
    res.redirect("/listings");

}));
router.get("/:id/contact",isloggedin,WrapAsync(async(req,res)=>{
    let {bookingdt,leavedt}=req.query;
    let {id}=req.params;
    let ownerobject=await Listing.findById(id).populate("owner");
    let owneremail=ownerobject.owner.email;
    let curruseremail=req.user.email;
    console.log(owneremail);
    console.log(curruseremail);
    console.log(bookingdt);
    console.log(leavedt);
    console.log(id);
    await ContactOwner(bookingdt,leavedt,owneremail,curruseremail);
    

    req.flash("success","Done!!! Owner will contact you soon.....");

    res.redirect(`/listings`);
}));
router.get("/:id/edit",isloggedin,isowner,WrapAsync(async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    if(!list){
        req.flash("error","Listing Not Found!");
        return res.redirect("/listings");

    }
    res.render("listings/edit.ejs",{list});

}));
router.put("/:id",isloggedin,isowner,upload.single('listing[image]'),validateListing,WrapAsync(async(req,res)=>{
    let {id}=req.params;
    let updatedlisting=await Listing.findByIdAndUpdate(id,{...req.body});
    if(typeof req.file !=='undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        updatedlisting.image={url,filename};
        await updatedlisting.save();

    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
    
}));
router.delete("/:id",isloggedin,isowner,WrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!"); 
    res.redirect("/listings");

}));
module.exports=router;
