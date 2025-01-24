const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const experienceSchema=new Schema({
        comment:String,
        createdAt:{
            type:Date,
            default:Date.now()
        },
        author:{
            type:Schema.Types.ObjectId,
            ref:"User",
        }
});

module.exports=mongoose.model("Experience",experienceSchema);