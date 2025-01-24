const express=require("express");
const Listing=require("../models/listings.js");
const wrapAscync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,experienceSchema}=require("../Schema.js");
const Experience = require("../models/experience.js");
const {isLoggedIn,isOwner}=require("../middleware.js");


const router=express.Router();

const validateError=((req,res,next)=>{
    let result=listingSchema.validate(req.body); 
    if(result.error){
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
});

//index route
router.get("/",wrapAscync(async(req,res)=>{
    let listings=await Listing.find({});
    res.render("listings/index.ejs",{listings});
}));

//new route
router.get("/new",isLoggedIn,wrapAscync(async(req,res)=>{
    res.render("listings/new.ejs");
}));
//show route
router.get("/:id",isLoggedIn,wrapAscync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"experience",populate:{path:"author"}}).populate("owner");

    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you want to find does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));
//saving new route
router.post("/",validateError,wrapAscync(async(req,res,next)=>{
    let listing=req.body.listings;
    let newListing=new Listing(listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Added successfully");
    res.redirect("/listings");
}));
//edit post route
router.put("/:id",validateError,isOwner,wrapAscync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listings});
    req.flash("success","Updated Successfully");
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAscync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully");
    res.redirect("/listings");
}));
//edit get route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAscync(async(req,res)=>{
    let {id}=req.params;
   
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you want to find does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});

}));

module.exports=router;