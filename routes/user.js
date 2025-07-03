const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../utils/wrapasync");
const passport=require("passport");
const { saveredirecturl } = require("../middelware.js");
const otp=require("../utils/otp.js");
const {OtpVerification } = require("../utils/ownermessage.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");

})
router.get("/signup/verifyotp",async(req,res)=>{
    let otpval=otp();
    req.session.otpval=otpval;
    let {email}=req.query;
    console.log(otpval);
    await OtpVerification(otpval,email);
    res.json({ message: "OTP sent to email" });
    // console.log("done");
})
router.post("/signup",WrapAsync(async (req,res)=>{
    const {submittedotp,username,email,password}=req.body;
    // console.log(typeof(submittedotp));
    // console.log(typeof(req.session.otpval));
    if(submittedotp!==String(req.session.otpval)){
        req.flash("error","Otp was incorrect");
        return res.redirect("/signup");
    }
    try{

        let newuser =new User({email,username});
        const reguser=await User.register(newuser,password);
        //implementing auto login after signup
        req.login(reguser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        })


    }catch(er){
        req.flash("error",er.message);
        res.redirect("/signup");

    }
    

}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",saveredirecturl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async (req,res)=>{
    req.flash("success","Welcome!!! You are logged in...");
    let urlredirect=res.locals.redirecturl || "/listings";//it is done bcz if we login through listing then islogged in middleware wil not be triggered

    res.redirect(urlredirect);

})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    })


})
 module.exports=router;
