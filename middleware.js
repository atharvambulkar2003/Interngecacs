let Listing=require("./models/listings.js");
module.exports.isLoggedIn=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Login Required");
        res.redirect("/login");
    }
    next();
});
module.exports.redirectToPage=((req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectTo=req.session.redirectUrl;
    }
    next();
});
module.exports.isOwner=(async(req,res,next)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.userInfo._id)){
        req.flash("error","you are not owner of this internship");
        return res.redirect(`/listings/${id}`);
    }
    next();
})