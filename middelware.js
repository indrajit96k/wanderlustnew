const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirecting to tat page where we need to be logged in
        req.session.redirecturl=req.originalUrl;
        req.flash("error","You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();

}
module.exports.isowner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);

    }
    next();

}
module.exports.isreviewauthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review= await Review.findById(reviewid);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);

    }
    next();

}