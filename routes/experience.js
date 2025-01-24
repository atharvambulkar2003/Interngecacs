const express=require("express");
const Listing=require("../models/listings.js");
const wrapAscync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Experience = require("../models/experience.js");
const {experienceSchema}=require("../Schema.js");
const router=express.Router({mergeParams:true});
const validateExperience=((req,res,next)=>{
    let result=experienceSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
});
//reviews
//post route
router.post("/",validateExperience,wrapAscync(async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    let newExper=new Experience(req.body.Experience);
    newExper.author=req.user._id;
    listing.experience.push(newExper);

    await newExper.save();
    await listing.save();
    console.log(newExper);
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:expid",async(req,res)=>{
    let {id,expid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{experience:expid}});
    await Experience.findByIdAndDelete(expid);
    res.redirect(`/listings/${id}`);

})
module.exports=router;