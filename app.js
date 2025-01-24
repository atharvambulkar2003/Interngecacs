const express=require("express");
const app=express();
const mongoose = require('mongoose');
const Listing=require("./models/listings.js");
const path=require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAscync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,experienceSchema}=require("./Schema.js");
const Experience = require("./models/experience.js");
const listing=require("./routes/listing.js");
const experience=require("./routes/experience.js");
const session=require("express-session");
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const UserRoute=require("./routes/user.js");
const ApplicantRoute=require("./routes/applicant.js");

const sessionOption={
    secret:"MyNewSecreat",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));
app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());//middleware 
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.userInfo=req.user;
    next();
})


app.use("/listings",listing);
app.use("/listings/:id/experience",experience);
app.use("/",UserRoute);
app.use("/",ApplicantRoute);



main()
.then(()=>{
    console.log("Connected");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/interngecacs');
}



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("listings/error.ejs",{err});
});
app.listen(8085,()=>{
    console.log("App is listening on port 8081");
});