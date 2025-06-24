const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../utils/wrapasync");
const passport=require("passport");
const { saveredirecturl } = require("../middelware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");

})
router.post("/signup",WrapAsync(async (req,res)=>{
    try{
        const {username,email,password}=req.body;
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
