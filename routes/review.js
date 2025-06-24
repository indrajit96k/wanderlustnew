const express=require("express");
const router=express.Router({mergeParams:true}); 
const WrapAsync=require("../utils/wrapasync.js");
const { listingschema, reviewschema } = require("../schema.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {isloggedin,isreviewauthor}=require("../middelware.js"); 
const validatereview=(req,res,next)=>{
    //use joi validation for schema 
    let {error}=reviewschema.validate(req.body.review);
        // console.log(x);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
}
router.post("/",isloggedin,validatereview,WrapAsync(async(req,res)=>{
    let currlisting=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;  
    currlisting.reviews.push(newreview);
    await newreview.save();   
    await currlisting.save();   
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${req.params.id}`); 
}))
//delete route for reviews;
router.delete("/:reviewid",isloggedin,isreviewauthor,WrapAsync(async (req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`); 
    
}))
module.exports=router;