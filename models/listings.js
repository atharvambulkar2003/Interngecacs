const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Experience = require("./experience.js");

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
    experience:[{
        type:Schema.Types.ObjectId,
        ref:"Experience",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        console.log(listing);
        await Experience.deleteMany({_id:{$in:listing.experience}});
        console.log("Deleted");
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;