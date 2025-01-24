const express=require("express");
const Listing=require("../models/listings.js");
const router=express.Router({mergeParams:true});
const wrapAscync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Applicant=require("../models/applicant.js");
const {isLoggedIn}=require("../middleware.js");
const {applicantSchema}=require("../Schema.js");

const validateApplicant=((req,res,next)=>{
    let result=applicantSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError("500",result.error);
    }else{
        next()
    }
});

router.get("/listings/:id/applicant",isLoggedIn,wrapAscync((req,res,next)=>{
    let{id}=req.params;
    res.render("../views/applicant/apply.ejs",{id});
}));
router.post("/listings/:id/applicant",isLoggedIn,validateApplicant,wrapAscync(async(req,res,next)=>{
    let{id}=req.params;
    let newApplicant=new Applicant(req.body.applicant);
    newApplicant.internship=id;
    let applicant=await newApplicant.save();
    req.flash("success","Applied successfully, shortly contacted through email");
    // console.log(applicant);
    res.redirect(`/listings`);
}));
router.get("/listings/:id/show",isLoggedIn,wrapAscync(async(req,res,next)=>{
    const{id}=req.params;
    const listing=[];
    listing.push(await Applicant.find({}));
    const applicants=[];
    console.log(listing);
    for(let list of listing[0]){
       if(list.internship==id){
            applicants.push(list);
       }
    }
    console.log(applicants);
    res.render("../views/listings/showListings.ejs",{applicants});
}));
module.exports=router;
