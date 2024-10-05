const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    companyName:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    stipend:{
        type:Number,
        required:true
    },
    deadline:{
        type:String,
        required:true
    },
    requirements:{
        type:String,
        required:true
    },
    contactEmail:{
        type:String,
        required:true
    },
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;