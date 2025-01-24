const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { redirectToPage } = require("../middleware.js");

router.get("/signup",async(req,res)=>{
    res.render("../views/user/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,password,email}=req.body;
        let newUser=new User({username,email});
        const user=await User.register(newUser,password);
        req.login(user,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User Registered Successfully");
            res.redirect("/listings");
        });       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login",(req,res)=>{
    res.render("../views/user/login");
});

router.post("/login",redirectToPage,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),async(req,res)=>{
    req.flash("success","User login successfully");
    let newUrl=res.locals.redirectTo||"/listings";
    res.redirect(newUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","Logout Successfully");
        res.redirect("/listings");
    })
});

module.exports=router;