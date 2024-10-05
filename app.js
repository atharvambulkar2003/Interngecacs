const express=require("express");
const app=express();
const mongoose = require('mongoose');
const Listing=require("./models/listings.js");
const path=require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAscync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./Schema.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));

const validateError=((req,res,next)=>{
    let result=listingSchema.validate(req.body); 
    if(result.error){
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
})

main()
.then(()=>{
    console.log("Connected");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/interngecacs');
}
app.get("/",(req,res)=>{
    res.send("Home route");
});
//index route
app.get("/listings",wrapAscync(async(req,res)=>{
    let listings=await Listing.find({});
    res.render("listings/index.ejs",{listings});
}));

//new route
app.get("/listings/new",wrapAscync(async(req,res)=>{
    res.render("listings/new.ejs");
}));
//show route
app.get("/listings/:id",wrapAscync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));
//saving new route
app.post("/listings",validateError,wrapAscync(async(req,res,next)=>{
    let listing=req.body.listings;
    let newListing=new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
}));
//edit get route
app.get("/listings/:id/edit",wrapAscync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));
//edit post route
app.put("/listings/:id",validateError,wrapAscync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listings});
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAscync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("listings/error.ejs",{err});
});
app.listen(8081,()=>{
    console.log("App is listening on port 8081");
});